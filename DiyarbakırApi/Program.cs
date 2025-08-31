using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;

// ================== BUILDER ==================
var builder = WebApplication.CreateBuilder(args);

// ---------------- Services ----------------
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("SqlServer")
             ?? "Server=LAPTOP-M4E7MKSK\\SQLEXPRESS;Database=DiyarbakirDb;Trusted_Connection=True;TrustServerCertificate=True";
    opt.UseSqlServer(cs);
});

// --------- CORS (SPA) ---------
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("spa", p =>
    {
#if DEBUG
        p.SetIsOriginAllowed(_ => true)
#else
        p.WithOrigins(
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://localhost",
            "https://localhost"
        )
#endif
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// --------- JWT (cookie + Authorization) ---------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        var jwt = builder.Configuration.GetSection("Jwt");
        var key = jwt["Key"] ?? "";

        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ClockSkew = TimeSpan.Zero
        };

        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                // 1) Authorization: Bearer ... (varsa)
                var auth = ctx.Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(auth) && auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    ctx.Token = auth.Substring("Bearer ".Length).Trim();
                    return Task.CompletedTask;
                }
                // 2) Cookie (access_token)
                if (ctx.Request.Cookies.TryGetValue("access_token", out var token))
                    ctx.Token = token;
                return Task.CompletedTask;
            }
        };
    });

// RBAC
builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("IsUser",       p => p.RequireRole("User","SuperUser","Supervisor","Admin"));
    o.AddPolicy("IsSuperUser",  p => p.RequireRole("SuperUser","Admin"));
    o.AddPolicy("IsSupervisor", p => p.RequireRole("Supervisor","Admin"));
    o.AddPolicy("IsAdmin",      p => p.RequireRole("Admin"));

    // YENİ: Mekan ekleme izni (SuperUser + Supervisor + Admin)
    o.AddPolicy("CanAddPlace",  p => p.RequireRole("SuperUser","Supervisor","Admin"));
});

var app = builder.Build();
var isDev = app.Environment.IsDevelopment();

app.UseCors("spa");
app.UseAuthentication();
app.UseAuthorization();

// ------------- DB migrate + seed ----------
using (var scope = app.Services.CreateScope())
{
    var db  = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var cfg = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    db.Database.Migrate();

    if (!db.Places.Any())
    {
        db.Places.AddRange(PlaceSeed.Data);
        db.SaveChanges();
    }

    // Admin seed
    var adminCfg = cfg.GetSection("Admin");
    var adminEmail    = (adminCfg["Email"]    ?? "admin@local").Trim().ToLower();
    var adminUserName = (adminCfg["Username"] ?? "admin").Trim();
    var adminPass     = adminCfg["Password"];
    var adminUser = db.Users.SingleOrDefault(u => u.Email == adminEmail);
    if (adminUser is null)
    {
        db.Users.Add(new User {
            Username = adminUserName,
            Email = adminEmail,
            Role = "Admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(!string.IsNullOrWhiteSpace(adminPass) ? adminPass : "Admin!123")
        });
        db.SaveChanges();
    }
    else
    {
        adminUser.Username = adminUserName;
        adminUser.Role     = "Admin";
        if (!string.IsNullOrWhiteSpace(adminPass))
            adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPass);
        db.SaveChanges();
    }

    // Supervisor seed
    var supCfg = cfg.GetSection("Supervisor");
    var supEmail    = (supCfg["Email"]    ?? "supervisor@local").Trim().ToLower();
    var supUserName = (supCfg["Username"] ?? "supervisor").Trim();
    var supPass     = supCfg["Password"];
    var supUser = db.Users.SingleOrDefault(u => u.Email == supEmail);
    if (supUser is null)
    {
        db.Users.Add(new User {
            Username = supUserName,
            Email = supEmail,
            Role = "Supervisor",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(!string.IsNullOrWhiteSpace(supPass) ? supPass : "Sup3r!123")
        });
        db.SaveChanges();
    }
    else
    {
        supUser.Username = supUserName;
        supUser.Role     = "Supervisor";
        if (!string.IsNullOrWhiteSpace(supPass))
            supUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(supPass);
        db.SaveChanges();
    }

    // SuperUser seed
    var suCfg     = cfg.GetSection("SuperUser");
    var suEmail   = (suCfg["Email"]    ?? "superuser@local").Trim().ToLower();
    var suUser    = (suCfg["Username"] ?? "superuser").Trim();
    var suPass    = suCfg["Password"];
    var su = db.Users.SingleOrDefault(u => u.Email == suEmail);
    if (su is null)
    {
        db.Users.Add(new User {
            Username     = suUser,
            Email        = suEmail,
            Role         = "SuperUser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(!string.IsNullOrWhiteSpace(suPass) ? suPass : "Sup3r!123")
        });
        db.SaveChanges();
    }
    else
    {
        su.Username = suUser;
        su.Role     = "SuperUser";
        if (!string.IsNullOrWhiteSpace(suPass))
            su.PasswordHash = BCrypt.Net.BCrypt.HashPassword(suPass);
        db.SaveChanges();
    }
}

app.MapGet("/", () => Results.Ok(new { ok = true, api = "DiyarbakirApi" }));

#if DEBUG
app.MapPost("/__login-debug", async (LoginDto dto, AppDbContext db, IConfiguration cfg) =>
{
    try
    {
        var id = (dto.UsernameOrEmail ?? "").Trim();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == id || u.Email == id.ToLower());
        if (user is null) return Results.Ok(new { ok = false, where = "user" });
        if (!BCrypt.Net.BCrypt.Verify(dto.Password ?? "", user.PasswordHash))
            return Results.Ok(new { ok = false, where = "pwd" });

        var token = JwtHelper.GenerateToken(user, cfg);
        return Results.Ok(new { ok = true, token, user = new { user.Id, user.Username, user.Role } });
    }
    catch (Exception ex) { return Results.Ok(new { ok = false, where = "token", error = ex.Message }); }
});
app.MapGet("/__jwt", (IConfiguration cfg) =>
{
    var j = cfg.GetSection("Jwt");
    return Results.Ok(new { key_is_set = !string.IsNullOrWhiteSpace(j["Key"]), issuer = j["Issuer"], audience = j["Audience"] });
});
app.MapGet("/__users", async (AppDbContext db) =>
    await db.Users.Select(u => new { u.Id, u.Username, u.Email, u.Role, hasHash = u.PasswordHash != null }).ToListAsync());
app.MapGet("/__checkpwd", async (AppDbContext db, string id, string pass) =>
{
    var u = await db.Users.FirstOrDefaultAsync(x => x.Username == id || x.Email == id.ToLower());
    return u is null ? Results.NotFound() : Results.Ok(new { ok = BCrypt.Net.BCrypt.Verify(pass, u.PasswordHash) });
});
#endif

// ---------------- AUTH --------------------
var auth = app.MapGroup("/api/auth");

// Kayıt
auth.MapPost("/register", async (RegisterDto dto, AppDbContext db) =>
{
    dto = dto with
    {
        Username = (dto.Username ?? "").Trim(),
        Email = (dto.Email ?? "").Trim().ToLower()
    };

    if (dto.Username.Length < 3 || string.IsNullOrWhiteSpace(dto.Email) || (dto.Password?.Length ?? 0) < 6)
        return Results.BadRequest(new { message = "Geçersiz girdi (kullanıcı adı ≥3, parola ≥6)." });

    if (await db.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
        return Results.Conflict(new { message = "Kullanıcı adı ya da e-posta kullanımda." });

    var user = new User
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password!),
        Role = "User"
    };
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/api/users/{user.Id}", new { user.Id, user.Username, user.Email });
});

// Giriş -> HttpOnly cookie ayarla
auth.MapPost("/login", async (LoginDto dto, AppDbContext db, IConfiguration cfg, HttpResponse res) =>
{
    var id  = (dto.UsernameOrEmail ?? "").Trim();
    var pwd = dto.Password ?? "";

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == id || u.Email == id.ToLower());
    if (user is null || !BCrypt.Net.BCrypt.Verify(pwd, user.PasswordHash))
        return Results.Unauthorized();

    var token = JwtHelper.GenerateToken(user, cfg);

    var origin = res.HttpContext.Request.Headers.Origin.ToString();
    var isCrossSite = !string.IsNullOrEmpty(origin) &&
                      !origin.Contains(res.HttpContext.Request.Host.Host, StringComparison.OrdinalIgnoreCase);

    var cookie = new CookieOptions
    {
        HttpOnly = true,
        // Cross-site ise her zaman Secure; prod'da da Secure
        Secure   = isCrossSite || !isDev,
        SameSite = isCrossSite ? SameSiteMode.None : SameSiteMode.Lax,
        Expires  = DateTimeOffset.UtcNow.AddDays(7),
        Path     = "/"
    };

    res.Cookies.Append("access_token", token, cookie);
    return Results.Ok(new { username = user.Username, role = user.Role });
});

// Çıkış -> cookie sil
auth.MapPost("/logout", (HttpRequest req, HttpResponse res) =>
{
    var origin = req.Headers.Origin.ToString();
    var isCrossSite = !string.IsNullOrEmpty(origin) &&
                      !origin.Contains(req.Host.Host, StringComparison.OrdinalIgnoreCase);

    res.Cookies.Append("access_token", "", new CookieOptions
    {
        HttpOnly = true,
        Secure   = isCrossSite || !isDev,
        SameSite = isCrossSite ? SameSiteMode.None : SameSiteMode.Lax,
        Expires  = DateTimeOffset.UnixEpoch,
        Path     = "/"
    });
    return Results.Ok();
}).RequireAuthorization();

// /api/me
app.MapGet("/api/me", async (ClaimsPrincipal principal, AppDbContext db) =>
{
    var name = principal.FindFirstValue(ClaimTypes.Name) ?? "";
    var role = principal.FindFirstValue(ClaimTypes.Role) ?? "";
    var idStr = principal.FindFirstValue(ClaimTypes.NameIdentifier);
    User? u = null;
    if (int.TryParse(idStr, out var uid))
        u = await db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == uid);

    return Results.Ok(new
    {
        id = u?.Id,
        username = u?.Username ?? name,
        email = u?.Email,
        role = role
    });
}).RequireAuthorization();

// --------------- PUBLIC PLACES ------------
var places = app.MapGroup("/api/places");

places.MapGet("/", async (AppDbContext db) =>
    await db.Places.AsNoTracking().Where(p => p.Status == "Published").OrderBy(p => p.Name).ToListAsync());

places.MapGet("/{id:int}", async (int id, AppDbContext db) =>
{
    var p = await db.Places.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && x.Status == "Published");
    return p is null ? Results.NotFound() : Results.Ok(p);
});

// Mekan Ekle (SuperUser + Supervisor + Admin)
places.MapPost("/", async (Place input, ClaimsPrincipal pr, AppDbContext db) =>
{
    input.Id = 0;
    input.UpdatedAt = DateTime.UtcNow;

    var role = pr.FindFirstValue(ClaimTypes.Role) ?? "User";
    input.Status = (role == "Admin")
        ? (string.IsNullOrWhiteSpace(input.Status) ? "Draft" : input.Status)
        : "Draft";

    db.Places.Add(input);
    await db.SaveChangesAsync();
    return Results.Created($"/api/places/{input.Id}", new { input.Id, input.Status });
})
.RequireAuthorization("CanAddPlace");

// --------- COMMENTS (public read / add) ---------
places.MapGet("/{pid:int}/comments", async (int pid, AppDbContext db) =>
    await db.Comments.AsNoTracking()
        .Where(c => c.PlaceId == pid && c.Status == "Approved")
        .OrderByDescending(c => c.CreatedAt)
        .Select(c => new { c.Id, c.Body, c.CreatedAt })
        .ToListAsync());

places.MapPost("/{pid:int}/comments", async (int pid, AddCommentDto dto, ClaimsPrincipal user, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Body) || dto.Body.Trim().Length < 3)
        return Results.BadRequest(new { message = "Yorum çok kısa." });

    var placeExists = await db.Places.AnyAsync(p => p.Id == pid && p.Status == "Published");
    if (!placeExists) return Results.NotFound();

    var uidStr = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
    var uid = int.Parse(uidStr);

    db.Comments.Add(new Comment
    {
        PlaceId = pid,
        UserId = uid,
        Body = dto.Body.Trim(),
        Status = "Pending"
    });
    await db.SaveChangesAsync();
    return Results.Ok(new { ok = true, status = "Pending" });
}).RequireAuthorization("IsUser");

// --------------- MODERATION -------------
var mod = app.MapGroup("/api/mod").WithTags("Moderation").RequireAuthorization("IsSupervisor");

// Tüm yorumlar (status/q ile) – JOIN ile güvenli arama
mod.MapGet("/comments", async (string? status, string? q, AppDbContext db) =>
{
    var st = (status ?? "").Trim();
    var qq = (q ?? "").Trim();

    var query =
        from c in db.Comments.AsNoTracking()
        join p in db.Places.AsNoTracking() on c.PlaceId equals p.Id into pj
        from p in pj.DefaultIfEmpty()
        join u in db.Users.AsNoTracking() on c.UserId equals u.Id into uj
        from u in uj.DefaultIfEmpty()
        select new
        {
            c.Id, c.PlaceId, c.UserId, c.Body, c.CreatedAt, c.Status,
            PlaceName = p != null ? p.Name : null,
            UserName  = u != null ? u.Username : null
        };

    if (!string.IsNullOrWhiteSpace(st) && !st.Equals("All", StringComparison.OrdinalIgnoreCase))
        query = query.Where(x => x.Status == st);

    if (!string.IsNullOrWhiteSpace(qq))
        query = query.Where(x =>
            (x.Body ?? "").Contains(qq) ||
            (x.PlaceName ?? "").Contains(qq) ||
            (x.UserName ?? "").Contains(qq)
        );

    var list = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    return Results.Ok(list);
});

mod.MapPost("/comments/{id:int}/approve", async (int id, ClaimsPrincipal u, AppDbContext db) =>
{
    var c = await db.Comments.FindAsync(id); if (c is null) return Results.NotFound();
    c.Status = "Approved";
    c.ModeratedAt = DateTime.UtcNow;
    c.ModeratedByUserId = int.Parse(u.FindFirstValue(ClaimTypes.NameIdentifier)!);
    await db.SaveChangesAsync();
    return Results.Ok();
});
mod.MapPost("/comments/{id:int}/reject", async (int id, ClaimsPrincipal u, AppDbContext db) =>
{
    var c = await db.Comments.FindAsync(id); if (c is null) return Results.NotFound();
    c.Status = "Rejected";
    c.ModeratedAt = DateTime.UtcNow;
    c.ModeratedByUserId = int.Parse(u.FindFirstValue(ClaimTypes.NameIdentifier)!);
    await db.SaveChangesAsync();
    return Results.Ok();
});
mod.MapDelete("/comments/{id:int}", async (int id, AppDbContext db) =>
{
    var c = await db.Comments.FindAsync(id);
    if (c is null) return Results.NotFound();
    db.Comments.Remove(c);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
mod.MapPut("/comments/{id:int}", async (int id, UpdateCommentDto dto, AppDbContext db) =>
{
    var c = await db.Comments.FindAsync(id);
    if (c is null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Body))
        c.Body = dto.Body.Trim();

    if (!string.IsNullOrWhiteSpace(dto.Status))
    {
        var s = dto.Status.Trim();
        if (s is not ("Pending" or "Approved" or "Rejected"))
            return Results.BadRequest(new { message = "Geçersiz durum." });
        c.Status = s;
    }

    c.ModeratedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(new { c.Id, c.Status });
});

// --------------- ADMIN (Places & Users) -------------
var adminApi = app.MapGroup("/api/admin").WithTags("Admin").RequireAuthorization("IsAdmin");

// Places
adminApi.MapGet("/places", async (string? status, string? q, AppDbContext db) =>
{
    var query = db.Places.AsQueryable();
    if (!string.IsNullOrWhiteSpace(status)) query = query.Where(p => p.Status == status);
    if (!string.IsNullOrWhiteSpace(q))
    {
        q = q.ToLower();
        query = query.Where(p =>
            p.Name.ToLower().Contains(q) ||
            (p.Tags ?? "").ToLower().Contains(q) ||
            (p.Description ?? "").ToLower().Contains(q));
    }
    var list = await query.OrderByDescending(p => p.UpdatedAt).ToListAsync();
    return Results.Ok(list);
});

adminApi.MapPost("/places", async (Place input, AppDbContext db) =>
{
    input.Id = 0;
    if (string.IsNullOrWhiteSpace(input.Status)) input.Status = "Draft";
    input.UpdatedAt = DateTime.UtcNow;
    db.Places.Add(input);
    await db.SaveChangesAsync();
    return Results.Created($"/api/admin/places/{input.Id}", input);
});

adminApi.MapPut("/places/{id:int}", async (int id, Place input, AppDbContext db) =>
{
    var p = await db.Places.FindAsync(id);
    if (p is null) return Results.NotFound();

    p.Name = input.Name;
    p.Description = input.Description;
    p.ImageUrl = input.ImageUrl;
    p.Query = input.Query;
    p.Tags = input.Tags;
    p.DescriptionEn = input.DescriptionEn;
    p.TagsEn = input.TagsEn;
    p.IsFeatured = input.IsFeatured;
    if (!string.IsNullOrWhiteSpace(input.Status)) p.Status = input.Status;
    p.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

adminApi.MapPost("/places/{id:int}/publish", async (int id, AppDbContext db) =>
{
    var p = await db.Places.FindAsync(id);
    if (p is null) return Results.NotFound();
    p.Status = "Published";
    p.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(p);
});

adminApi.MapPost("/places/{id:int}/pending", async (int id, AppDbContext db) =>
{
    var p = await db.Places.FindAsync(id);
    if (p is null) return Results.NotFound();
    p.Status = "Pending";
    p.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(p);
});

adminApi.MapDelete("/places/{id:int}", async (int id, AppDbContext db) =>
{
    var p = await db.Places.FindAsync(id);
    if (p is null) return Results.NotFound();
    db.Places.Remove(p);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Users
adminApi.MapGet("/users", async (string? q, AppDbContext db) =>
{
    var query = db.Users.AsNoTracking();
    if (!string.IsNullOrWhiteSpace(q))
    {
        q = q.ToLower().Trim();
        query = query.Where(u =>
            u.Username.ToLower().Contains(q) ||
            u.Email.ToLower().Contains(q) ||
            u.Role.ToLower().Contains(q));
    }

    var list = await query
        .OrderBy(u => u.Id)
        .Select(u => new { u.Id, u.Username, u.Email, u.Role, u.CreatedAt })
        .ToListAsync();

    return Results.Ok(list);
});

adminApi.MapPut("/users/{id:int}", async (int id, UpdateUserDto dto, AppDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    var newUser = (dto.Username ?? "").Trim();
    var newMail = (dto.Email ?? "").Trim().ToLower();

    if (!string.IsNullOrEmpty(newUser) && newUser != u.Username)
    {
        var existsUser = await db.Users.AnyAsync(x => x.Username == newUser && x.Id != id);
        if (existsUser) return Results.Conflict(new { message = "Kullanıcı adı kullanımda." });
        u.Username = newUser;
    }
    if (!string.IsNullOrEmpty(newMail) && newMail != u.Email)
    {
        var existsMail = await db.Users.AnyAsync(x => x.Email == newMail && x.Id != id);
        if (existsMail) return Results.Conflict(new { message = "E-posta kullanımda." });
        u.Email = newMail;
    }

    await db.SaveChangesAsync();
    return Results.Ok(new { u.Id, u.Username, u.Email, u.Role });
});

adminApi.MapPut("/users/{id:int}/role", async (int id, RoleDto dto, ClaimsPrincipal pr, AppDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    var meIdStr = pr.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
    var meId = int.TryParse(meIdStr, out var _tmp) ? _tmp : 0;

    if (meId == id) return Results.BadRequest(new { message = "Kendi rolünüzü değiştiremezsiniz." });

    var role = (dto.Role ?? "").Trim();
    var allowed = new[] { "User", "SuperUser", "Supervisor", "Admin" };
    if (!allowed.Contains(role))
        return Results.BadRequest(new { message = "Geçersiz rol." });

    if (u.Role == "Admin" && role != "Admin")
    {
        var adminCount = await db.Users.CountAsync(x => x.Role == "Admin");
        if (adminCount <= 1)
            return Results.BadRequest(new { message = "Sistemde tek Admin varken rol düşürülemez." });
    }

    u.Role = role;
    await db.SaveChangesAsync();
    return Results.Ok(new { u.Id, u.Username, u.Role });
});

adminApi.MapDelete("/users/{id:int}", async (int id, ClaimsPrincipal pr, AppDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    var meIdStr = pr.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
    var meId = int.TryParse(meIdStr, out var _tmp) ? _tmp : 0;

    if (meId == id) return Results.BadRequest(new { message = "Kendi hesabınızı silemezsiniz." });

    if (u.Role == "Admin")
    {
        var adminCount = await db.Users.CountAsync(x => x.Role == "Admin");
        if (adminCount <= 1)
            return Results.BadRequest(new { message = "Sistemdeki son Admin silinemez." });
    }

    db.Users.Remove(u);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ---------- I18N ----------
var i18n = app.MapGroup("/api/i18n").WithTags("I18N").RequireAuthorization("IsSuperUser");
i18n.MapPost("/places/{id:int}/en", async (int id, EnPlaceDto dto, AppDbContext db) =>
{
    var p = await db.Places.FindAsync(id);
    if (p is null) return Results.NotFound();
    p.DescriptionEn = dto.DescriptionEn;
    p.TagsEn = dto.TagsEn;
    p.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();

// ================== TYPES ==================
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }
    public DbSet<Place> Places => Set<Place>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Place
        b.Entity<Place>().Property(p => p.Name).HasMaxLength(160).IsRequired();
        b.Entity<Place>().Property(p => p.Description).HasMaxLength(1000);
        b.Entity<Place>().Property(p => p.Query).HasMaxLength(200);
        b.Entity<Place>().Property(p => p.Tags).HasMaxLength(200);
        b.Entity<Place>().Property(p => p.DescriptionEn).HasMaxLength(1000);
        b.Entity<Place>().Property(p => p.TagsEn).HasMaxLength(200);
        b.Entity<Place>().HasIndex(p => p.Name);
        b.Entity<Place>().Property(p => p.Status).HasMaxLength(20).HasDefaultValue("Published");
        b.Entity<Place>().HasIndex(p => p.Status);
        b.Entity<Place>().Property(p => p.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

        // User
        b.Entity<User>().Property(u => u.Username).HasMaxLength(60).IsRequired();
        b.Entity<User>().Property(u => u.Email).HasMaxLength(160).IsRequired();
        b.Entity<User>().Property(u => u.Role).HasMaxLength(30).HasDefaultValue("User");
        b.Entity<User>().HasIndex(u => u.Username).IsUnique();
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // Comment
        b.Entity<Comment>().Property(c => c.Body).HasMaxLength(1000).IsRequired();
        b.Entity<Comment>().Property(c => c.Status).HasMaxLength(20).HasDefaultValue("Pending");
        b.Entity<Comment>().HasIndex(c => new { c.PlaceId, c.Status });
    }
}

public class Place
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Query { get; set; }
    public string? Tags { get; set; }
    public string? DescriptionEn { get; set; }
    public string? TagsEn { get; set; }
    public bool IsFeatured { get; set; }
    public string Status { get; set; } = "Published";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string Role { get; set; } = "User";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Comment
{
    public int Id { get; set; }
    public int PlaceId { get; set; }
    public int UserId { get; set; }
    public string Body { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending|Approved|Rejected
    public int? ModeratedByUserId { get; set; }
    public DateTime? ModeratedAt { get; set; }
}

// DTOs
public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string UsernameOrEmail, string Password);
public record AddCommentDto(string Body);
public record EnPlaceDto(string? DescriptionEn, string? TagsEn);
public record RoleDto(string Role);
public record UpdateUserDto(string? Username, string? Email);
public record UpdateCommentDto(string? Body, string? Status);

public static class JwtHelper
{
    public static string GenerateToken(User u, IConfiguration cfg)
    {
        var jwt = cfg.GetSection("Jwt");
        var keyStr = jwt["Key"];
        var issuer = jwt["Issuer"];
        var audience = jwt["Audience"];
        if (string.IsNullOrWhiteSpace(keyStr) || string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
            throw new InvalidOperationException("JWT config eksik (Key/Issuer/Audience).");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
            new Claim(ClaimTypes.Name, u.Username),
            new Claim(ClaimTypes.Email, u.Email),
            new Claim(ClaimTypes.Role, u.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public static class PlaceSeed
{
    public static readonly Place[] Data = new[]
    {
        new Place{
            Name="Ulu Cami",
            Description="Sur içi'nde tarihi cami. İslam dünyasının önemli mabedlerinden.",
            DescriptionEn="Historic mosque in the city center. One of the most important shrines in the Islamic world.",
            ImageUrl="assets/img/ulu-camii.jpg", Query="Ulu Cami, Diyarbakır",
            Tags="cami,tarihi,surici", TagsEn="mosque,historic,citywall", IsFeatured=true
        },
        new Place{
            Name="On Gözlü Köprü",
            Description="Dicle üzerinde taş kemerli tarihi köprü. Gün batımı manzarasıyla ünlü.",
            DescriptionEn="Historic stone bridge over the Tigris. Famous for its sunset view.",
            ImageUrl="assets/img/on-gozlu-kopru.jpg", Query="On Gözlü Köprü, Diyarbakır",
            Tags="köprü,dicle,manzara", TagsEn="bridge,tigris,view", IsFeatured=true
        },
        new Place{
            Name="Hevsel Bahçeleri",
            Description="UNESCO mirası; doğa yürüyüşü ve fotoğraf için ideal.",
            DescriptionEn="UNESCO heritage; ideal for nature walks and photography.",
            ImageUrl="assets/img/hevsel-bahceleri.jpg", Query="Hevsel Bahçeleri, Diyarbakır",
            Tags="bahçe,doğa,unesco", TagsEn="garden,nature,unesco", IsFeatured=true
        },
        new Place{
            Name="Hasan Paşa Hanı",
            Description="Tarihi han; yerel kahvaltı için popüler.",
            DescriptionEn="Historic inn; popular for local breakfast.",
            ImageUrl="assets/img/hasan-pasa-hani.jpg", Query="Hasan Paşa Hanı, Diyarbakır",
            Tags="han,kahvaltı,tarih", TagsEn="inn,breakfast,history", IsFeatured=false
        }
    };
}
