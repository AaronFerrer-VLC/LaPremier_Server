# 🎨 Configuración Render - 100% Gratis

## ✅ Checklist de Configuración

### 1. Variables de Entorno Requeridas

Añadir en Render → Environment:

```env
# Servidor
NODE_ENV=production
PORT=5005

# Base de Datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier

# Autenticación
JWT_SECRET=genera-un-secret-largo-y-seguro
JWT_EXPIRES_IN=7d

# CORS (URL de tu frontend en Vercel)
CORS_ORIGIN=https://tu-proyecto.vercel.app

# APIs Externas
TMDB_API_KEY=tu-api-key-de-tmdb
GEMINI_API_KEY=tu-api-key-de-gemini
GOOGLE_PLACES_API_KEY=tu-api-key-de-google-places
FOURSQUARE_API_KEY=tu-api-key-de-foursquare

# Cron Jobs (Render free tier soporta cron)
ENABLE_CRON=true
```

### 2. Generar JWT_SECRET Seguro

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiar el resultado y usarlo como `JWT_SECRET`.

### 3. Configuración Automática

Render detecta automáticamente:
- ✅ Node.js (por `package.json`)
- ✅ Build command: `npm install`
- ✅ Start command: `npm start` (definido en `package.json`)
- ✅ Puerto (asignado automáticamente o usar PORT=5005)

El archivo `render.yaml` optimiza la configuración.

### 4. Límites del Plan Gratuito

- ✅ **750 horas/mes** de ejecución (suficiente para 24/7)
- ✅ **Auto-sleep después de 15 minutos** de inactividad
- ✅ Se despierta automáticamente con la primera petición
- ✅ **Cron jobs incluidos** (gratis)

### 5. Cron Jobs en Render

Render free tier **SÍ soporta cron jobs**:

1. Render Dashboard → Cron Jobs → New Cron Job
2. Configurar:
   - Schedule: `0 9 * * 5` (Viernes a las 9:00 AM)
   - Command: `curl -X POST https://tu-servicio.onrender.com/api/scraping/cinemas/all -H "Authorization: Bearer tu-jwt-token"`
3. Guardar

O usar el cron job nativo de Node.js si `ENABLE_CRON=true`.

### 6. Monitoreo

- Ver logs en tiempo real en Render Dashboard
- Ver métricas de uso
- Configurar alertas si es necesario

---

## 🔧 Troubleshooting

### El servicio se duerme
- ✅ Normal en plan gratuito después de 15 min de inactividad
- ✅ Se despierta automáticamente con la primera petición
- ✅ Puede tardar 30-60 segundos en despertar
- ✅ Considerar plan de pago si necesitas 24/7 sin sleep

### Error de conexión a MongoDB
- ✅ Verificar `MONGODB_URI` en variables de entorno
- ✅ Verificar IP whitelist en MongoDB Atlas (debe ser `0.0.0.0/0`)
- ✅ Verificar usuario y password

### CORS errors
- ✅ Verificar `CORS_ORIGIN` apunta a tu frontend en Vercel
- ✅ No usar `*` en producción
- ✅ Incluir protocolo `https://`

### Build falla
- ✅ Verificar que todas las dependencias estén en `package.json`
- ✅ Verificar logs de build en Render
- ✅ Render usa `npm install` automáticamente

---

## 💡 Tips

1. **Dominio personalizado:** Puedes añadir tu dominio en Render Settings (gratis)
2. **Environment variables:** Nunca commitear `.env`, usar Render Environment
3. **Logs:** Revisar logs regularmente para detectar problemas
4. **Backups:** MongoDB Atlas tiene backups automáticos
5. **Auto-sleep:** Considerar usar servicio de "ping" para mantener despierto (opcional)

---

## ⚠️ Importante - Plan Gratuito

### Auto-Sleep
- El servicio se duerme después de 15 minutos de inactividad
- Se despierta automáticamente con la primera petición
- Puede tardar 30-60 segundos en responder la primera vez

### Solución (Opcional - Gratis)
Si quieres evitar el sleep, puedes usar un servicio de ping gratuito:
- [Uptime Robot](https://uptimerobot.com) - Ping cada 5 minutos (gratis)
- Configurar para hacer GET a `/health` cada 5 minutos

---

<div align="center">

**Render hace el deploy automático desde GitHub** 🚀

</div>

