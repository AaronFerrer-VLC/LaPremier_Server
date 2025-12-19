# ✅ Checklist de Despliegue en Render

## 📋 Pre-Deploy Checklist

### 1. Archivos de Configuración ✅
- [x] `render.yaml` - Configuración de Render
- [x] `package.json` - Scripts y dependencias
- [x] `.npmrc` - Optimizaciones de npm
- [x] `.gitignore` - Archivos ignorados
- [x] `Procfile` - (Opcional, Render usa render.yaml)

### 2. Scripts ✅
- [x] `npm start` - Inicia el servidor (`node app.js`)
- [x] Puerto configurado correctamente (usa `ENV.PORT`)

### 3. Endpoints Críticos ✅
- [x] `/health` - Health check para Render
- [x] Todas las rutas API funcionando

### 4. Variables de Entorno Requeridas

**⚠️ IMPORTANTE: Configurar en Render Dashboard → Environment**

#### Obligatorias:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
JWT_SECRET=genera-un-secret-largo-y-seguro
```

#### Recomendadas:
```env
PORT=5005
CORS_ORIGIN=https://tu-frontend.vercel.app
ENABLE_CRON=true
```

#### APIs Externas:
```env
TMDB_API_KEY=tu-api-key
GEMINI_API_KEY=tu-api-key
GOOGLE_PLACES_API_KEY=tu-api-key
FOURSQUARE_API_KEY=tu-api-key
```

### 5. Base de Datos ✅
- [x] MongoDB Atlas configurado
- [x] IP whitelist: `0.0.0.0/0` (para permitir Render)
- [x] Usuario y password configurados
- [x] Connection string correcto

### 6. CORS ✅
- [x] `CORS_ORIGIN` configurado con URL del frontend
- [x] Middleware de CORS funcionando

### 7. Seguridad ✅
- [x] `JWT_SECRET` seguro (64+ caracteres)
- [x] Helmet configurado
- [x] Rate limiting activo
- [x] Variables sensibles en Render (no en código)

### 8. Dependencias Pesadas ⚠️
- [x] Puppeteer configurado (puede tardar 5-10 min en build)
- [x] `.npmrc` optimizado para Render

### 9. Health Check ✅
- [x] Endpoint `/health` implementado
- [x] Render configurado para usar `/health`
- [x] Health check no está rate-limited

### 10. Cron Jobs ✅
- [x] `ENABLE_CRON=true` si quieres cron nativo
- [x] O usar Render Dashboard → Cron Jobs

---

## 🚀 Pasos de Despliegue

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **En Render Dashboard:**
   - New → Web Service
   - Conectar GitHub
   - Seleccionar repositorio y carpeta `LaPremier_Server`
   - Render detecta Node.js automáticamente

3. **Configurar Variables de Entorno:**
   - Environment → Add Environment Variable
   - Añadir todas las variables del checklist

4. **Deploy:**
   - Create Web Service
   - Esperar build (5-10 min por Puppeteer)
   - Verificar logs

5. **Verificar:**
   - `https://tu-proyecto.onrender.com/health` → debe responder OK
   - Probar endpoints de API

---

## ⚠️ Problemas Comunes

### Build se queda atascado
- **Causa:** Puppeteer descargando Chromium
- **Solución:** Esperar 5-10 minutos (normal)

### Error de conexión a MongoDB
- **Causa:** IP whitelist o credenciales incorrectas
- **Solución:** Verificar `0.0.0.0/0` en MongoDB Atlas

### CORS errors
- **Causa:** `CORS_ORIGIN` incorrecto
- **Solución:** Verificar URL exacta del frontend

### Servicio se duerme
- **Causa:** Normal en plan gratis (15 min inactividad)
- **Solución:** Se despierta automáticamente, o usar Uptime Robot

---

## ✅ Post-Deploy

- [ ] Verificar `/health` endpoint
- [ ] Probar autenticación
- [ ] Probar endpoints de API
- [ ] Verificar logs en Render Dashboard
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar cron jobs si es necesario

---

<div align="center">

**¡Todo listo para desplegar!** 🚀

</div>

