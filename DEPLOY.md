# 🚀 Guía de Despliegue en Producción - 100% GRATIS

> ✅ **Esta guía está optimizada para mantener tu aplicación 100% GRATIS usando los planes gratuitos de Render, Vercel y MongoDB Atlas**

## 📋 Stack Recomendado (100% Gratis)

### 🎯 Configuración Completa Gratuita

- **Backend:** Render (Plan Gratuito)
- **Frontend:** Vercel (Plan Gratuito)
- **Base de Datos:** MongoDB Atlas (Plan M0 Gratuito - 512MB)
- **Cron Jobs:** Render (incluido en plan gratis) o cron-job.org
- **Total:** $0/mes - **SIN COSTOS**

## 📋 Opciones Recomendadas

### 🎯 Backend (LaPremier_Server)

#### ⭐ Opción 1: Render (Recomendado - 100% Gratis)

**Ventajas:**

- ✅ Setup en minutos
- ✅ Variables de entorno fáciles
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ **Plan gratuito permanente** (750 horas/mes)
- ✅ **Cron jobs incluidos** (gratis)
- ✅ Auto-sleep después de inactividad (ahorra recursos)

**⚠️ IMPORTANTE - Plan Gratuito:**

- ✅ 750 horas de ejecución/mes (suficiente para 24/7)
- ✅ Auto-sleep después de 15 minutos de inactividad
- ✅ Se despierta automáticamente con la primera petición
- ✅ Cron jobs nativos incluidos (gratis)

**Pasos:**

1. Crear cuenta en [Render.com](https://render.com) (con GitHub)
2. "New" → "Web Service"
3. Conectar GitHub y seleccionar repositorio
4. Configurar:
   - **Name:** `lapremier-server`
   - **Root Directory:** `LaPremier_Server` (si el repo tiene ambas carpetas)
   - **Environment:** `Node`
   - **Build Command:** `npm install` (automático)
   - **Start Command:** `npm start` (automático)
5. Añadir variables de entorno (ver abajo)
6. Deploy → ¡Listo! Obtienes URL: `https://tu-proyecto.onrender.com`

**Variables de entorno en Render (100% Gratis):**

```env
NODE_ENV=production
PORT=5005
MONGODB_URI=mongodb+srv://... (MongoDB Atlas M0 - GRATIS)
JWT_SECRET=tu-secret-super-seguro
CORS_ORIGIN=https://tu-frontend.vercel.app
TMDB_API_KEY=tu-key
GEMINI_API_KEY=tu-key
GOOGLE_PLACES_API_KEY=tu-key
FOURSQUARE_API_KEY=tu-key
ENABLE_CRON=true
# Render free tier SÍ soporta cron jobs nativos
```

**💰 Precio:** **GRATIS** (750 horas/mes)

**📝 Nota sobre Auto-Sleep:**

- El servicio se duerme después de 15 minutos de inactividad
- Se despierta automáticamente con la primera petición (30-60 segundos)
- Para evitar sleep: usar [Uptime Robot](https://uptimerobot.com) (gratis) para ping cada 5 minutos

**📝 Nota sobre Cron Jobs:**

- ✅ Render free tier **SÍ soporta cron jobs nativos**
- ✅ Puedes usar `ENABLE_CRON=true` y el cron job de Node.js funcionará
- ✅ O configurar cron job en Render Dashboard

---

#### 🥈 Opción 2: Railway

**Ventajas:**

- ✅ Plan gratuito (500 horas/mes + $5 crédito)
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ No tiene auto-sleep

**Precio:** Gratis hasta cierto uso, luego ~$5/mes

**Nota:** Railway free tier no soporta cron jobs nativos, usar cron-job.org

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

**Backend: Render (Plan Gratuito)**

- ✅ 750 horas/mes de ejecución (suficiente para 24/7)
- ✅ Auto-sleep después de 15 min inactividad (ahorra recursos)
- ✅ Se despierta automáticamente
- ✅ Cron jobs nativos incluidos (gratis)
- ✅ Configurado con `render.yaml`

**Frontend: Vercel (Plan Gratuito)**

- ✅ 100GB bandwidth/mes (miles de usuarios)
- ✅ Deploys ilimitados
- ✅ CDN global
- ✅ Configurado con `vercel.json`

**Base de Datos: MongoDB Atlas M0 (Plan Gratuito)**

- ✅ 512MB almacenamiento
- ✅ Backups automáticos
- ✅ Suficiente para producción inicial

**Cron Jobs: Render (Incluido)**

- ✅ Cron jobs nativos incluidos en plan gratis
- ✅ Configurar en Render Dashboard o usar `ENABLE_CRON=true`
- ✅ Alternativa: cron-job.org (gratis) si prefieres externo

**💰 Total:** **$0/mes - 100% GRATIS**

### 📊 Límites del Plan Gratuito

| Servicio      | Límite Gratuito | ¿Suficiente?              |
| ------------- | --------------- | ------------------------- |
| Render        | 750 horas/mes   | ✅ Sí (24/7)              |
| Vercel        | 100GB/mes       | ✅ Sí (miles de usuarios) |
| MongoDB Atlas | 512MB           | ✅ Sí (10k+ cines)        |
| Render Cron   | Incluido        | ✅ Sí                     |

### ⚠️ Importante - Mantener Gratis

1. **Render:** 750 horas/mes es suficiente para 24/7 (gratis)
2. **Vercel:** Si superas 100GB, necesitarás plan Pro ($20/mes)
3. **MongoDB:** Si superas 512MB, necesitarás plan M2 ($9/mes)
4. **Gemini:** Ya configurado para nunca exceder cuota gratuita (18/20 requests/día)
5. **Auto-sleep:** Render se duerme después de 15 min inactividad (normal, se despierta automáticamente)

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

### Render (Backend)

1. **Crear servicio:**

   - Render.com → New → Web Service
   - Conectar GitHub y seleccionar repositorio
   - Root Directory: `LaPremier_Server` (si aplica)

2. **Configuración:**

   - Name: `lapremier-server`
   - Environment: `Node`
   - Build Command: `npm install` (automático)
   - Start Command: `npm start` (automático)

3. **Variables de entorno:**

   ```
   NODE_ENV=production
   PORT=5005
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
   JWT_SECRET=genera-un-secret-super-largo-y-seguro-aqui
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://tu-frontend.vercel.app
   TMDB_API_KEY=tu-key
   GEMINI_API_KEY=tu-key
   GOOGLE_PLACES_API_KEY=tu-key
   FOURSQUARE_API_KEY=tu-key
   ENABLE_CRON=true
   ```

4. **Deploy automático:**

   - Render detecta `package.json`
   - Instala dependencias automáticamente
   - Ejecuta `npm start`

5. **Obtener URL:**
   - Render te da: `https://tu-proyecto.onrender.com`
   - Puedes usar dominio personalizado (gratis)

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
6. Reemplazar `<password>` con tu password → guardar para Render

**Resultado:** `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier`

---

### 2. Backend en Render - 5 minutos

1. Crear cuenta en [Render.com](https://render.com) (con GitHub - gratis)
2. "New" → "Web Service"
3. Conectar GitHub y seleccionar tu repositorio
4. Configurar servicio:
   - **Name:** `lapremier-server`
   - **Root Directory:** `LaPremier_Server` (si el repo tiene ambas carpetas)
   - **Environment:** `Node`
   - **Build Command:** `npm install` (automático)
   - **Start Command:** `npm start` (automático)
5. Environment → Add Environment Variable → añadir todas las variables:

```env
NODE_ENV=production
PORT=5005
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
JWT_SECRET=genera-con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tu-frontend.vercel.app
TMDB_API_KEY=tu-api-key
GEMINI_API_KEY=tu-api-key
GOOGLE_PLACES_API_KEY=tu-api-key
FOURSQUARE_API_KEY=tu-api-key
ENABLE_CRON=true
```

6. Create Web Service → esperar a que termine el deploy
7. Obtener URL automática (ej: `https://tu-proyecto.onrender.com`)

**Resultado:** Backend funcionando en `https://tu-proyecto.onrender.com`

**⚠️ Nota:** El servicio puede tardar 30-60 segundos en despertar si está dormido (normal en plan gratis)

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

Volver a Render → Environment → actualizar:

```env
CORS_ORIGIN=https://tu-proyecto.vercel.app
```

Redeploy automático.

---

### 5. Cron Jobs (Opcional - Ya Incluido)

Render free tier **SÍ soporta cron jobs nativos**. Dos opciones:

**Opción A: Usar cron job de Node.js (Recomendado)**

- Ya configurado con `ENABLE_CRON=true`
- Se ejecuta automáticamente los viernes a las 9:00 AM
- Funciona mientras el servicio esté despierto

**Opción B: Configurar en Render Dashboard**

1. Render Dashboard → Cron Jobs → New Cron Job
2. Configurar:
   - Schedule: `0 9 * * 5` (Viernes a las 9:00 AM)
   - Command: `curl -X POST https://tu-proyecto.onrender.com/api/scraping/cinemas/all -H "Authorization: Bearer tu-jwt-token"`
3. Guardar

**Resultado:** Actualización automática de carteleras cada viernes

**💡 Tip:** Para mantener el servicio despierto y que el cron funcione mejor, usar [Uptime Robot](https://uptimerobot.com) (gratis) para ping cada 5 minutos a `/health`

---

## ✅ Verificación Final

1. ✅ Backend: `https://tu-proyecto.onrender.com/health` → debe responder OK
   - ⚠️ Primera petición puede tardar 30-60 segundos (servicio despertando)
2. ✅ Frontend: `https://tu-proyecto.vercel.app` → debe cargar
3. ✅ Conexión: Frontend debe poder llamar al backend
4. ✅ Base de datos: Verificar en MongoDB Atlas que se crean colecciones

**💰 Total:** **$0/mes - 100% GRATIS**

**📝 Nota sobre Auto-Sleep:**

- El servicio puede tardar 30-60 segundos en responder la primera vez después de dormir
- Esto es normal en el plan gratuito de Render
- Para evitar sleep: usar [Uptime Robot](https://uptimerobot.com) (gratis) para ping cada 5 minutos

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
- Verificar `PORT=5005` (o dejar que Render asigne automáticamente)
- Revisar logs en Render Dashboard
- Verificar que el build haya terminado correctamente

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

- 📖 Documentación de Render: https://render.com/docs
- 📖 Documentación de Vercel: https://vercel.com/docs
- 📖 Documentación de MongoDB Atlas: https://docs.atlas.mongodb.com
- 📖 Guía específica Render: Ver [RENDER_SETUP.md](./RENDER_SETUP.md)

---

<div align="center">

**¡Despliega tu aplicación en minutos!** 🚀

</div>
