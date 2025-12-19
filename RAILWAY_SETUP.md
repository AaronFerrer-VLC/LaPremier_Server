# 🚂 Configuración Railway - 100% Gratis

## ✅ Checklist de Configuración

### 1. Variables de Entorno Requeridas

Añadir en Railway → Variables:

```env
# Servidor
NODE_ENV=production
PORT=5005
# Nota: Railway asigna puerto automáticamente, pero PORT puede ser útil

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

# Cron Jobs (deshabilitado en Railway free tier)
ENABLE_CRON=false
```

### 2. Generar JWT_SECRET Seguro

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiar el resultado y usarlo como `JWT_SECRET`.

### 3. Configuración Automática

Railway detecta automáticamente:
- ✅ Node.js (por `package.json`)
- ✅ Build command: `npm install`
- ✅ Start command: `npm start` (definido en `package.json`)
- ✅ Puerto (asignado automáticamente)

El archivo `railway.json` optimiza la configuración.

### 4. Límites del Plan Gratuito

- ✅ **500 horas/mes** de ejecución (suficiente para 24/7)
- ✅ **$5 crédito gratis/mes**
- ✅ Si superas el crédito, el servicio se **pausa** (no cobra)
- ✅ Puedes reactivar manualmente

### 5. Monitoreo

- Ver logs en tiempo real en Railway Dashboard
- Ver uso de recursos en Metrics
- Configurar alertas si es necesario

---

## 🔧 Troubleshooting

### El servicio se pausa
- ✅ Normal si superas $5/mes de crédito
- ✅ Reactivar manualmente en Railway Dashboard
- ✅ Optimizar uso o considerar plan de pago si creces

### Error de conexión a MongoDB
- ✅ Verificar `MONGODB_URI` en variables de entorno
- ✅ Verificar IP whitelist en MongoDB Atlas (debe ser `0.0.0.0/0`)
- ✅ Verificar usuario y password

### CORS errors
- ✅ Verificar `CORS_ORIGIN` apunta a tu frontend en Vercel
- ✅ No usar `*` en producción
- ✅ Incluir protocolo `https://`

---

## 💡 Tips

1. **Dominio personalizado:** Puedes añadir tu dominio en Railway Settings
2. **Environment variables:** Nunca commitear `.env`, usar Railway Variables
3. **Logs:** Revisar logs regularmente para detectar problemas
4. **Backups:** MongoDB Atlas tiene backups automáticos

---

<div align="center">

**Railway hace el deploy automático desde GitHub** 🚀

</div>

