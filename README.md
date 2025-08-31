# DiyarbakırApp

Diyarbakır’a gelen ziyaretçiler için hızlı bir **turist rehberi** ve **“Nasıl Giderim?”** harita uygulaması.  
**Frontend:** Leaflet tabanlı hafif bir SPA  
**Backend:** ASP.NET Core Web API + SQL Server + EF Core

> Canlı demo yoksa: Frontend’i yerelde çalıştırıp `localStorage.apiBase` üzerinden API adresini vererek kullanabilirsiniz.

---

## ✨ Özellikler

- 🗺️ Harita (Leaflet) üzerinde yerler, kategoriler, detay sayfaları
- ➡️ “Nasıl Giderim?” (yürüme/araç) için rota çizimi *(servise bağlıdır)*
- ⭐ Önerilen/Popüler yerler alanı
- 🌐 Çok dilli yapı (TR/EN) – varsayılan Türkçe
- 🔎 Arama & filtreleme
- 🛡️ Yönetici uçları (Admin) için `X-Admin-Token` başlığı
- 🚀 Basit, hızlı, kolay kurulum

---

## 🔧 Gereksinimler

- **.NET 8 SDK** (veya proje sürümün)
- **SQL Server** / SQL Express
- **Node.js** (opsiyonel, statik sunucu için)
- **VS Code Live Server** eklentisi (opsiyonel)

---

## 🗄️ Backend Kurulumu (ASP.NET Core)

```bash
cd DiyarbakirApi
dotnet restore

# EF CLI yoksa:
dotnet tool install --global dotnet-ef

# Veritabanını güncelle (migration'ların hazır olduğu varsayımıyla):
dotnet ef database update

# Çalıştır:
dotnet run
