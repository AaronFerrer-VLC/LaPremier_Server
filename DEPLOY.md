# 🚀 Guía de Despliegue en Producción - 100% GRATIS

> ✅ **Esta guía está optimizada para mantener tu aplicación 100% GRATIS usando los planes gratuitos de Railway, Vercel y MongoDB Atlas**

## 📋 Stack Recomendado (100% Gratis)

### 🎯 Configuración Completa Gratuita

- **Backend:** Railway (Plan Gratuito)
- **Frontend:** Vercel (Plan Gratuito)
- **Base de Datos:** MongoDB Atlas (Plan M0 Gratuito - 512MB)
- **Cron Jobs:** cron-job.org (Gratis) o deshabilitados
- **Total:** $0/mes - **SIN COSTOS**

## 📋 Opciones Recomendadas

### 🎯 Backend (LaPremier_Server)

#### ⭐ Opción 1: Railway (Recomendado - 100% Gratis)

**Ventajas:**

- ✅ Setup en minutos
- ✅ Variables de entorno fáciles
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ **Plan gratuito permanente** (500 horas/mes)
- ✅ **$5 de crédito gratis** cada mes

**⚠️ IMPORTANTE - Plan Gratuito:**

- ✅ 500 horas de ejecución/mes (suficiente para 24/7)
- ✅ $5 de crédito gratis/mes
- ✅ Si superas el crédito, el servicio se pausa (no cobra)
- ✅ Puedes reactivar manualmente

**Pasos:**

1. Crear cuenta en [Railway.app](https://railway.app) (con GitHub)
2. "New Project" → "Deploy from GitHub"
3. Seleccionar repositorio y carpeta `LaPremier_Server`
4. Railway detecta Node.js automáticamente (usa `railway.json`)
5. Añadir variables de entorno (ver abajo)
6. ¡Listo! Obtienes URL: `https://tu-proyecto.up.railway.app`

**Variables de entorno en Railway (100% Gratis):**

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://... (MongoDB Atlas M0 - GRATIS)
JWT_SECRET=tu-secret-super-seguro
CORS_ORIGIN=https://tu-frontend.vercel.app
TMDB_API_KEY=tu-key
GEMINI_API_KEY=tu-key
GOOGLE_PLACES_API_KEY=tu-key
ENABLE_CRON=false
# Nota: Railway free tier no soporta cron nativo
# Usar cron-job.org gratis para llamar a la API
```

**💰 Precio:** **GRATIS** (500 horas/mes + $5 crédito/mes)

**📝 Nota sobre Cron Jobs:**

- Railway free tier no soporta cron jobs nativos
- Solución: Usar [cron-job.org](https://cron-job.org) (gratis)
- Configurar para llamar a `/api/scraping/cinemas/all` los viernes

---

#### 🥈 Opción 2: Render

**Ventajas:**

- ✅ Plan gratuito permanente
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ MongoDB disponible

**Pasos:**

1. Crear cuenta en [Render.com](https://render.com)
2. "New" → "Web Service"
3. Conectar GitHub y seleccionar `LaPremier_Server`
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Añadir variables de entorno
6. Deploy

**Precio:** Gratis (con limitaciones), $7/mes para plan sin limitaciones

---

#### 🥉 Opción 3: DigitalOcean App Platform

**Ventajas:**

- ✅ Muy estable
- ✅ Escalable
- ✅ Buena documentación

**Precio:** Desde $5/mes

---

#### 🏆 Opción 4: VPS (DigitalOcean, Linode, Hetzner)

**Ventajas:**

- ✅ Control total
- ✅ Más económico a largo plazo
- ✅ Flexibilidad completa

**Pasos:**

1. Crear VPS (Ubuntu 22.04)
2. Instalar Node.js, PM2, Nginx
3. Configurar dominio y SSL (Let's Encrypt)
4. Deploy con PM2

**Precio:** Desde $4-6/mes

---

### 🎨 Frontend (LaPremier_client)

#### ⭐ Opción 1: Vercel (Recomendado - 100% Gratis)

**Ventajas:**

- ✅ Optimizado para React/Vite
- ✅ Deploy instantáneo
- ✅ CDN global
- ✅ HTTPS automático
- ✅ **Plan gratuito permanente** (muy generoso)
- ✅ Preview deployments
- ✅ **100GB de bandwidth/mes** (suficiente para miles de usuarios)

**⚠️ IMPORTANTE - Plan Gratuito:**

- ✅ 100GB de bandwidth/mes
- ✅ Deploys ilimitados
- ✅ Dominios personalizados gratis
- ✅ SSL automático

**Pasos:**

1. Crear cuenta en [Vercel.com](https://vercel.com) (con GitHub)
2. "Add New Project"
3. Importar desde GitHub
4. Seleccionar repositorio y carpeta `LaPremier_client`
5. Vercel detecta Vite automáticamente (usa `vercel.json`)
6. Añadir variables de entorno (ver abajo)
7. Deploy automático

**Variables de entorno en Vercel (100% Gratis):**

```env
VITE_APP_API_URL=https://tu-backend.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=tu-key
```

**💰 Precio:** **GRATIS** (100GB bandwidth/mes - más que suficiente)

---

#### 🥈 Opción 2: Netlify

**Ventajas:**

- ✅ Similar a Vercel
- ✅ Plan gratuito
- ✅ Formularios incluidos
- ✅ Functions serverless

**Pasos:**

1. Crear cuenta en [Netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Seleccionar repositorio y carpeta `LaPremier_client`
4. Configurar build:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Añadir variables de entorno
6. Deploy

**Precio:** Gratis, Pro desde $19/mes

---

#### 🥉 Opción 3: Cloudflare Pages

**Ventajas:**

- ✅ Gratis e ilimitado
- ✅ CDN global de Cloudflare
- ✅ Muy rápido

**Precio:** Gratis

---

## 🗄️ Base de Datos MongoDB

### ⭐ Opción 1: MongoDB Atlas (Recomendado - 100% Gratis)

**Ventajas:**

- ✅ **Plan gratuito permanente** (M0 - 512MB)
- ✅ Backups automáticos
- ✅ Escalable cuando lo necesites
- ✅ Muy fácil de configurar
- ✅ **512MB es suficiente** para miles de cines y películas

**⚠️ IMPORTANTE - Plan Gratuito M0:**

- ✅ 512MB de almacenamiento
- ✅ Shared RAM y CPU
- ✅ Perfecto para aplicaciones pequeñas/medianas
- ✅ Puedes escalar cuando crezcas

**Pasos:**

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
2. Crear cluster gratuito (M0 - Free Shared)
3. Seleccionar región (Europa para España - mejor latencia)
4. Configurar Network Access:
   - Add IP Address → `0.0.0.0/0` (permite desde cualquier IP)
5. Database Access → Add New Database User:
   - Username: `lapremier_user`
   - Password: generar password seguro
   - Database User Privileges: `Read and write to any database`
6. Connect → Connect your application:
   - Copiar connection string
   - Reemplazar `<password>` con tu password
   - Usar en `MONGODB_URI` en Railway

**💰 Precio:** **GRATIS** (512MB - suficiente para producción inicial)

**📊 Capacidad del Plan Gratuito:**

- ~10,000 cines
- ~50,000 películas
- ~100,000 reseñas
- Más que suficiente para empezar

---

### 🥈 Opción 2: Railway MongoDB

Si usas Railway para el backend, puedes usar su MongoDB incluido.

---

## 🎯 Stack Recomendado Completo - 100% GRATIS

### ✅ Configuración Optimizada para Gratis

**Backend: Railway (Plan Gratuito)**

- ✅ 500 horas/mes de ejecución (suficiente para 24/7)
- ✅ $5 crédito gratis/mes
- ✅ Auto-pausa si superas crédito (no cobra)
- ✅ Configurado con `railway.json`

**Frontend: Vercel (Plan Gratuito)**

- ✅ 100GB bandwidth/mes (miles de usuarios)
- ✅ Deploys ilimitados
- ✅ CDN global
- ✅ Configurado con `vercel.json`

**Base de Datos: MongoDB Atlas M0 (Plan Gratuito)**

- ✅ 512MB almacenamiento
- ✅ Backups automáticos
- ✅ Suficiente para producción inicial

**Cron Jobs: cron-job.org (Gratis)**

- ✅ Llamadas ilimitadas
- ✅ Configurar para actualizar carteleras los viernes

**💰 Total:** **$0/mes - 100% GRATIS**

### 📊 Límites del Plan Gratuito

| Servicio      | Límite Gratuito | ¿Suficiente?              |
| ------------- | --------------- | ------------------------- |
| Railway       | 500 horas/mes   | ✅ Sí (24/7)              |
| Vercel        | 100GB/mes       | ✅ Sí (miles de usuarios) |
| MongoDB Atlas | 512MB           | ✅ Sí (10k+ cines)        |
| cron-job.org  | Ilimitado       | ✅ Sí                     |

### ⚠️ Importante - Mantener Gratis

1. **Railway:** Si superas $5/mes, el servicio se pausa (no cobra)
2. **Vercel:** Si superas 100GB, necesitarás plan Pro ($20/mes)
3. **MongoDB:** Si superas 512MB, necesitarás plan M2 ($9/mes)
4. **Gemini:** Ya configurado para nunca exceder cuota gratuita (18/20 requests/día)

---

## 📝 Checklist de Despliegue

### Backend

- [ ] Variables de entorno configuradas
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` seguro y largo
- [ ] `CORS_ORIGIN` configurado (no `*`)
- [ ] MongoDB Atlas configurado
- [ ] IP whitelist en MongoDB
- [ ] Health check funcionando
- [ ] Logs configurados

### Frontend

- [ ] Variables de entorno configuradas
- [ ] `VITE_APP_API_URL` apunta al backend
- [ ] Build exitoso (`npm run build`)
- [ ] Redirecciones SPA configuradas (`_redirects`)
- [ ] Google Maps API key configurada
- [ ] Dominio personalizado (opcional)

---

## 🔧 Configuración Detallada

### Railway (Backend)

1. **Crear proyecto:**

   - Railway.app → New Project → Deploy from GitHub
   - Seleccionar `LaPremier_Server`

2. **Variables de entorno:**

   ```
   PORT=5005
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
   JWT_SECRET=genera-un-secret-super-largo-y-seguro-aqui
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://tu-frontend.vercel.app
   TMDB_API_KEY=tu-key
   GEMINI_API_KEY=tu-key
   GOOGLE_PLACES_API_KEY=tu-key
   ENABLE_CRON=true
   ```

3. **Deploy automático:**

   - Railway detecta `package.json`
   - Instala dependencias automáticamente
   - Ejecuta `npm start`

4. **Obtener URL:**
   - Railway te da: `https://tu-proyecto.up.railway.app`
   - Puedes usar dominio personalizado

---

### Vercel (Frontend)

1. **Crear proyecto:**

   - Vercel.com → Add New Project
   - Importar desde GitHub
   - Seleccionar `LaPremier_client`

2. **Configuración de build:**

   ```
   Framework Preset: Vite
   Root Directory: LaPremier_client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variables de entorno:**

   ```
   VITE_APP_API_URL=https://tu-backend.railway.app
   VITE_GOOGLE_MAPS_API_KEY=tu-key
   ```

4. **Deploy:**
   - Vercel hace build automáticamente
   - Obtienes: `https://tu-proyecto.vercel.app`
   - Puedes usar dominio personalizado

---

### MongoDB Atlas

1. **Crear cluster:**

   - MongoDB Atlas → Create Cluster
   - Seleccionar región (Europa para España)
   - Plan M0 (Free)

2. **Configurar acceso:**

   - Network Access → Add IP Address
   - Para producción: `0.0.0.0/0` (todos)
   - Database Access → Add User
   - Crear usuario con password

3. **Obtener connection string:**
   - Connect → Connect your application
   - Copiar connection string
   - Reemplazar `<password>` con tu password
   - Usar en `MONGODB_URI`

---

## 🔒 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] `JWT_SECRET` largo y aleatorio (mínimo 32 caracteres)
- [ ] `CORS_ORIGIN` específico (no `*`)
- [ ] MongoDB con autenticación
- [ ] IP whitelist en MongoDB (si es posible)
- [ ] HTTPS habilitado (automático en Railway/Vercel)
- [ ] Variables de entorno no en código
- [ ] Rate limiting configurado
- [ ] Helmet.js activo (ya incluido)

### 🔐 Generar JWT_SECRET Seguro

```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O usar openssl
openssl rand -hex 64
```

---

## 📊 Monitoreo

### Opciones Recomendadas

1. **Railway Logs** - Incluido en Railway
2. **Vercel Analytics** - Incluido en Vercel
3. **Sentry** - Error tracking (gratis hasta cierto punto)
4. **Uptime Robot** - Monitoreo de uptime (gratis)

---

## 🚀 Pasos Rápidos - Setup 100% Gratis

### 1. MongoDB Atlas (Base de Datos) - 5 minutos

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
2. Crear cluster M0 (Free Shared) - seleccionar región Europa
3. Network Access → Add IP Address → `0.0.0.0/0`
4. Database Access → Add User → crear usuario y password
5. Connect → Connect your application → copiar connection string
6. Reemplazar `<password>` con tu password → guardar para Railway

**Resultado:** `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier`

---

### 2. Backend en Railway - 5 minutos

1. Crear cuenta en [Railway.app](https://railway.app) (con GitHub - gratis)
2. "New Project" → "Deploy from GitHub"
3. Seleccionar tu repositorio
4. Seleccionar carpeta `LaPremier_Server`
5. Railway detecta Node.js automáticamente (usa `railway.json`)
6. Variables → Add Variable → añadir todas las variables de entorno:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
JWT_SECRET=genera-con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-frontend.vercel.app
TMDB_API_KEY=tu-api-key
GEMINI_API_KEY=tu-api-key
GOOGLE_PLACES_API_KEY=tu-api-key
ENABLE_CRON=false
```

7. Deploy automático → esperar a que termine
8. Settings → Generate Domain → copiar URL (ej: `https://tu-proyecto.up.railway.app`)

**Resultado:** Backend funcionando en `https://tu-proyecto.up.railway.app`

---

### 3. Frontend en Vercel - 3 minutos

1. Crear cuenta en [Vercel.com](https://vercel.com) (con GitHub - gratis)
2. "Add New Project" → Import from GitHub
3. Seleccionar tu repositorio
4. Configurar proyecto:
   - Framework Preset: **Vite** (detectado automáticamente)
   - Root Directory: `LaPremier_client`
   - Build Command: `npm run build` (automático)
   - Output Directory: `dist` (automático)
5. Environment Variables → añadir:

```env
VITE_APP_API_URL=https://tu-proyecto.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=tu-api-key
```

6. Deploy → esperar a que termine
7. Obtener URL (ej: `https://tu-proyecto.vercel.app`)

**Resultado:** Frontend funcionando en `https://tu-proyecto.vercel.app`

---

### 4. Configurar CORS en Backend

Volver a Railway → Variables → actualizar:

```env
CORS_ORIGIN=https://tu-proyecto.vercel.app
```

Redeploy automático.

---

### 5. Cron Jobs (Opcional - Gratis)

Railway free tier no soporta cron nativos. Usar [cron-job.org](https://cron-job.org) (gratis):

1. Crear cuenta en cron-job.org (gratis)
2. Create Cronjob
3. URL: `https://tu-proyecto.up.railway.app/api/scraping/cinemas/all`
4. Method: POST
5. Headers: `Authorization: Bearer tu-jwt-token`
6. Schedule: Todos los viernes a las 9:00 AM
7. Guardar

**Resultado:** Actualización automática de carteleras cada viernes

---

## ✅ Verificación Final

1. ✅ Backend: `https://tu-proyecto.up.railway.app/health` → debe responder OK
2. ✅ Frontend: `https://tu-proyecto.vercel.app` → debe cargar
3. ✅ Conexión: Frontend debe poder llamar al backend
4. ✅ Base de datos: Verificar en MongoDB Atlas que se crean colecciones

**💰 Total:** **$0/mes - 100% GRATIS**

---

## 💡 Tips y Mejores Prácticas - Mantener Gratis

1. **Dominios personalizados (Gratis):**

   - Comprar dominio en Namecheap/GoDaddy (~$10/año)
   - Configurar DNS en Railway/Vercel (gratis)
   - SSL automático (gratis)

2. **Environment variables:**

   - ✅ Nunca commitear `.env`
   - ✅ Usar variables de entorno de Railway/Vercel
   - ✅ Diferentes valores para dev/prod

3. **Backups (Gratis):**

   - ✅ MongoDB Atlas tiene backups automáticos (gratis)
   - ✅ Configurar backups manuales si es necesario

4. **Performance (Optimizado):**

   - ✅ Vercel tiene CDN automático (gratis)
   - ✅ Imágenes optimizadas (ya implementado)
   - ✅ Lazy loading implementado

5. **Cron Jobs (Gratis):**

   - ⚠️ Railway free tier NO soporta cron nativos
   - ✅ Usar [cron-job.org](https://cron-job.org) (gratis)
   - ✅ Configurar para llamar a `/api/scraping/cinemas/all`

6. **Monitoreo (Gratis):**

   - ✅ Railway logs incluidos
   - ✅ Vercel Analytics (opcional, gratis)
   - ✅ Uptime Robot (gratis) para monitoreo

7. **Mantener Gratis:**
   - ✅ Monitorear uso en Railway Dashboard
   - ✅ Optimizar queries a MongoDB
   - ✅ Usar caching cuando sea posible
   - ✅ Gemini ya configurado para nunca exceder cuota gratuita

---

## 🆘 Troubleshooting

### Backend no inicia

- Verificar `MONGODB_URI`
- Verificar `PORT` (Railway asigna automáticamente)
- Revisar logs en Railway

### Frontend no conecta al backend

- Verificar `VITE_APP_API_URL`
- Verificar CORS en backend
- Verificar que backend esté corriendo

### MongoDB connection error

- Verificar IP whitelist (0.0.0.0/0 para producción)
- Verificar usuario y password
- Verificar connection string

---

## 📞 Soporte

Para problemas de despliegue:

- 📖 Documentación de Railway: https://docs.railway.app
- 📖 Documentación de Vercel: https://vercel.com/docs
- 📖 Documentación de MongoDB Atlas: https://docs.atlas.mongodb.com

---

<div align="center">

**¡Despliega tu aplicación en minutos!** 🚀

</div>
