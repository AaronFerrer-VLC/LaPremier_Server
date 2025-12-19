<div align="center">

# 🎬 LaPremier Server

### Backend API para la plataforma de cines más completa de España

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.20-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

**API RESTful moderna con integración de IA para actualización automática de carteleras**

</div>

---

## ✨ Características Principales

### 🎯 Core Features

- 🚀 **API RESTful** completa con Express.js
- 💾 **MongoDB** con Mongoose ODM
- 🔐 **Autenticación JWT** segura
- 🛡️ **Middleware de seguridad** (Helmet, CORS, Rate Limiting)
- 📊 **Logging** con Morgan
- ⚡ **Validación** de datos con express-validator

### 🤖 Inteligencia Artificial

- 🧠 **Integración con Google Gemini** para extracción automática de películas
- 🕷️ **Web Scraping** inteligente con Puppeteer
- 🎬 **Matching automático** con TMDB
- ⏰ **Actualización automática** de carteleras (cron jobs)
- 🛡️ **100% Gratis** - Protección contra exceder cuota gratuita

### 🎭 Gestión de Contenido

- 🎬 **Gestión completa de películas** (CRUD)
- 🏛️ **Gestión de cines** con información detallada
- ⭐ **Sistema de reseñas** y valoraciones
- ❤️ **Favoritos** de usuarios
- 🔍 **Búsqueda avanzada** y filtros

---

## 🚀 Inicio Rápido

### 📋 Prerrequisitos

- **Node.js** v20 o superior
- **MongoDB** v4.4 o superior (local o MongoDB Atlas)
- **npm** o **yarn**

### 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd LaPremier_Server

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=5005
NODE_ENV=development
CORS_ORIGIN=*

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/lapremier

# Autenticación
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRES_IN=7d

# APIs Externas
TMDB_API_KEY=tu-api-key-de-tmdb
GEMINI_API_KEY=tu-api-key-de-gemini
GOOGLE_PLACES_API_KEY=tu-api-key-de-google-places
FOURSQUARE_API_KEY=tu-api-key-de-foursquare

# Cron Jobs
ENABLE_CRON=true
```

### 🗄️ Migración de Datos

Si tienes datos existentes en `db.json`, migra a MongoDB:

```bash
npm run migrate
```

Este script:

- ✅ Conecta a MongoDB
- ✅ Lee datos de `db.json`
- ✅ Importa cines, películas y reseñas
- ✅ Muestra estadísticas de migración

### ▶️ Ejecutar el Servidor

**Modo desarrollo (con auto-reload):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El servidor estará disponible en `http://localhost:5005` (o el puerto configurado).

---

## 📚 API Endpoints

### 🏥 Health Check

```
GET /health
```

Verifica el estado del servidor y la conexión a la base de datos.

### 🎬 Películas (Movies)

| Método   | Endpoint      | Descripción                     |
| -------- | ------------- | ------------------------------- |
| `GET`    | `/movies`     | Obtener todas las películas     |
| `GET`    | `/movies/:id` | Obtener película por ID         |
| `POST`   | `/movies`     | Crear nueva película            |
| `PUT`    | `/movies/:id` | Actualizar película             |
| `PATCH`  | `/movies/:id` | Actualización parcial           |
| `DELETE` | `/movies/:id` | Eliminar película (soft delete) |

**Query Params:**

- `deleted` - Filtrar por eliminadas
- `released` - Filtrar por estrenadas
- `gender` - Filtrar por género

### 🏛️ Cines (Cinemas)

| Método   | Endpoint       | Descripción                 |
| -------- | -------------- | --------------------------- |
| `GET`    | `/cinemas`     | Obtener todos los cines     |
| `GET`    | `/cinemas/:id` | Obtener cine por ID         |
| `POST`   | `/cinemas`     | Crear nuevo cine            |
| `PUT`    | `/cinemas/:id` | Actualizar cine             |
| `PATCH`  | `/cinemas/:id` | Actualización parcial       |
| `DELETE` | `/cinemas/:id` | Eliminar cine (soft delete) |

**Query Params:**

- `deleted` - Filtrar por eliminados
- `city` - Filtrar por ciudad

### ⭐ Reseñas (Reviews)

| Método   | Endpoint       | Descripción               |
| -------- | -------------- | ------------------------- |
| `GET`    | `/reviews`     | Obtener todas las reseñas |
| `GET`    | `/reviews/:id` | Obtener reseña por ID     |
| `POST`   | `/reviews`     | Crear nueva reseña        |
| `PUT`    | `/reviews/:id` | Actualizar reseña         |
| `PATCH`  | `/reviews/:id` | Actualización parcial     |
| `DELETE` | `/reviews/:id` | Eliminar reseña           |

**Query Params:**

- `movieId` - Filtrar por película
- `rating` - Filtrar por valoración

### 🔐 Autenticación

| Método | Endpoint             | Descripción             |
| ------ | -------------------- | ----------------------- |
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login`    | Iniciar sesión          |
| `POST` | `/api/auth/refresh`  | Refrescar token         |

### 🤖 IA y Scraping

| Método | Endpoint                    | Descripción                | Auth |
| ------ | --------------------------- | -------------------------- | ---- |
| `GET`  | `/api/scraping/status`      | Estado de uso de IA        | ✅   |
| `POST` | `/api/scraping/cinemas/all` | Actualizar todos los cines | ✅   |
| `POST` | `/api/scraping/cinemas/:id` | Actualizar cine específico | ✅   |

### 🎬 TMDB Proxy

| Método | Endpoint                         | Descripción              |
| ------ | -------------------------------- | ------------------------ |
| `GET`  | `/api/external/tmdb/movie/:id`   | Obtener película de TMDB |
| `GET`  | `/api/external/tmdb/search`      | Buscar en TMDB           |
| `GET`  | `/api/external/tmdb/now-playing` | Películas en cartelera   |

---

## 🤖 Sistema de IA para Carteleras

### 🎯 Características

- **Extracción automática** de películas de webs de cines
- **Matching inteligente** con TMDB
- **Actualización automática** los viernes a las 9:00 AM
- **100% Gratis** - Protección contra exceder cuota gratuita

### 📊 Límites del Plan Gratuito

- **20 requests/día por modelo** (se detiene en 18 para seguridad)
- **1.5M tokens/día** (se detiene en 1.35M para seguridad)
- **15 requests/minuto** (respetado automáticamente)

### 🚀 Uso

**Verificar estado:**

```bash
node scripts/checkGeminiStatus.js
```

**Actualizar un cine:**

```bash
node scripts/updateCinemaMovies.js <cinemaId>
```

**Actualizar todos los cines:**

```bash
node scripts/updateCinemaMovies.js
```

**Ver documentación completa:** Ver sección de IA en este README.

---

## 🗂️ Estructura del Proyecto

```
LaPremier_Server/
├── 📁 config/
│   ├── database.js          # Conexión MongoDB
│   └── env.js               # Variables de entorno
│
├── 📁 controllers/
│   ├── authController.js           # Autenticación
│   ├── cinemaController.js         # Gestión de cines
│   ├── cinemaScrapingController.js # IA y scraping
│   ├── favoriteController.js       # Favoritos
│   ├── movieController.js          # Gestión de películas
│   ├── reviewController.js         # Reseñas
│   └── tmdbController.js           # Proxy TMDB
│
├── 📁 middleware/
│   ├── auth.js             # Autenticación JWT
│   ├── cors.js              # CORS
│   ├── errorHandler.js      # Manejo de errores
│   ├── rateLimiter.js       # Rate limiting
│   └── validation.js        # Validación
│
├── 📁 models/
│   ├── Cinema.js            # Modelo de cine
│   ├── Favorite.js          # Modelo de favorito
│   ├── Movie.js             # Modelo de película
│   ├── Review.js            # Modelo de reseña
│   └── User.js              # Modelo de usuario
│
├── 📁 routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── cinemas.js           # Rutas de cines
│   ├── cinemaScraping.js    # Rutas de scraping
│   ├── externalAPI.js      # Rutas de APIs externas
│   ├── favorites.js         # Rutas de favoritos
│   ├── movies.js            # Rutas de películas
│   └── reviews.js           # Rutas de reseñas
│
├── 📁 services/
│   ├── aiService.js              # Servicio de IA (Gemini)
│   ├── geminiRateLimiter.js      # Rate limiter para Gemini
│   ├── movieMatchingService.js   # Matching con TMDB
│   └── scrapingService.js       # Web scraping
│
├── 📁 scripts/
│   ├── checkGeminiStatus.js      # Verificar estado de IA
│   ├── createAdminUser.js        # Crear usuario admin
│   ├── migrateToMongoDB.js       # Migración de datos
│   ├── setupCronJob.js           # Configurar cron jobs
│   ├── testGeminiConnection.js    # Probar conexión Gemini
│   └── updateCinemaMovies.js      # Actualizar carteleras
│
├── 📁 utils/
│   └── logger.js            # Sistema de logging
│
├── app.js                   # Aplicación principal
└── package.json             # Dependencias
```

---

## 🗄️ Modelos de Base de Datos

### 🎬 Movie (Película)

```javascript
{
  title: { original: String, spanish: String },
  poster: String,
  country: String,
  language: String,
  displayLanguage: String,  // "ES", "V.O.", "ES + V.O."
  countryCode: String,      // ISO 3166-1
  duration: Number,
  director: String,
  gender: [String],
  casting: [{ name: String, photo: String }],
  date: Date,
  released: Boolean,
  calification: String,
  trailer: String,
  description: String,
  tmdbId: Number,           // ID de TMDB
  isDeleted: Boolean
}
```

### 🏛️ Cinema (Cine)

```javascript
{
  name: String,
  cover: [String],
  url: String,
  address: {
    street: String,
    city: String,
    zipcode: Number,
    country: String
  },
  location: { lat: Number, lng: Number },
  price: {
    regular: Number,
    weekend: Number,
    special: Number
  },
  specs: {
    VO: Boolean,
    is3D: Boolean,
    accesibility: Boolean
  },
  capacity: {
    dicerooms: Number,
    seating: Number
  },
  services: [String],
  movieId: [Number],        // IDs de TMDB
  isDeleted: Boolean
}
```

### ⭐ Review (Reseña)

```javascript
{
  rating: Number,            // 1-5
  comment: String,
  user: String,
  movieId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 👤 User (Usuario)

```javascript
{
  username: String,
  email: String,
  password: String,          // Hasheado
  role: String,             // 'admin' | 'user'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Scripts Disponibles

| Script                               | Descripción                              |
| ------------------------------------ | ---------------------------------------- |
| `npm start`                          | Iniciar servidor en producción           |
| `npm run dev`                        | Iniciar servidor en desarrollo (nodemon) |
| `npm run migrate`                    | Migrar datos de JSON a MongoDB           |
| `node scripts/createAdminUser.js`    | Crear usuario administrador              |
| `node scripts/checkGeminiStatus.js`  | Verificar estado de IA                   |
| `node scripts/updateCinemaMovies.js` | Actualizar carteleras                    |

---

## 🛡️ Seguridad

### ✅ Implementado

- 🔐 **JWT Authentication** con tokens seguros
- 🛡️ **Helmet.js** para headers de seguridad
- 🚦 **Rate Limiting** para prevenir abusos
- ✅ **Validación de datos** con express-validator
- 🔒 **CORS** configurado
- 🔑 **Variables de entorno** para datos sensibles
- 🚫 **Soft Delete** para preservar datos

### 🔐 Autenticación

- Tokens JWT con expiración configurable
- Passwords hasheados con bcryptjs
- Middleware de autenticación en rutas protegidas
- Refresh tokens para renovación automática

---

## 🌐 Integraciones

### 🎬 TMDB (The Movie Database)

- Proxy de API para evitar CORS
- Búsqueda de películas
- Películas en cartelera
- Detalles completos de películas
- Manejo de errores y rate limiting

### 🤖 Google Gemini AI

- Extracción automática de películas de webs
- Matching inteligente con TMDB
- Actualización automática de carteleras
- Protección 100% gratuita

### 🗺️ Google Places API

- Búsqueda de cines
- Información de ubicaciones
- Geocodificación

### 📍 Foursquare API

- Información adicional de lugares
- Datos de cines

---

## 📊 Variables de Entorno

| Variable                | Descripción                      | Requerido     | Default       |
| ----------------------- | -------------------------------- | ------------- | ------------- |
| `PORT`                  | Puerto del servidor              | No            | `5005`        |
| `NODE_ENV`              | Entorno (development/production) | No            | `development` |
| `CORS_ORIGIN`           | Orígenes permitidos              | No            | `*`           |
| `MONGODB_URI`           | URI de conexión MongoDB          | **Sí**        | -             |
| `JWT_SECRET`            | Secret para JWT                  | **Sí** (prod) | -             |
| `JWT_EXPIRES_IN`        | Expiración de tokens             | No            | `7d`          |
| `TMDB_API_KEY`          | API Key de TMDB                  | No            | -             |
| `GEMINI_API_KEY`        | API Key de Gemini                | No            | -             |
| `GOOGLE_PLACES_API_KEY` | API Key de Google Places         | No            | -             |
| `FOURSQUARE_API_KEY`    | API Key de Foursquare            | No            | -             |
| `ENABLE_CRON`           | Habilitar cron jobs              | No            | `false`       |

---

## 🚀 Despliegue en Producción

> 📖 **Guía completa:** Ver [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas paso a paso

### 🎯 Opciones Recomendadas

#### ⭐ Backend: Railway (Recomendado - Más Fácil)

- ✅ Setup en minutos
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ Plan gratuito generoso
- 💰 Gratis hasta cierto uso, luego ~$5/mes

#### 🥈 Backend: Render

- ✅ Plan gratuito permanente
- ✅ Auto-deploy desde GitHub
- 💰 Gratis (con limitaciones)

#### 🥉 Backend: DigitalOcean App Platform

- ✅ Muy estable y escalable
- 💰 Desde $5/mes

#### ⭐ Frontend: Vercel (Recomendado)

- ✅ Optimizado para React/Vite
- ✅ Deploy instantáneo
- ✅ CDN global
- 💰 Gratis (muy generoso)

#### 🥈 Frontend: Netlify

- ✅ Similar a Vercel
- ✅ Plan gratuito
- 💰 Gratis

#### ⭐ Base de Datos: MongoDB Atlas

- ✅ Plan gratuito permanente (512MB)
- ✅ Backups automáticos
- 💰 Gratis (512MB), desde $9/mes

### 🚀 Stack Recomendado (100% Gratis)

- **Backend:** Railway (gratis)
- **Frontend:** Vercel (gratis)
- **Base de Datos:** MongoDB Atlas (gratis - 512MB)
- **Total:** $0/mes

### ✅ Checklist Pre-Producción

1. **Variables de Entorno**

   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lapremier
   JWT_SECRET=secret-super-seguro-y-largo
   CORS_ORIGIN=https://tu-frontend.vercel.app
   ```

2. **MongoDB**

   - ✅ Usar MongoDB Atlas (recomendado)
   - ✅ Configurar autenticación
   - ✅ Habilitar backups
   - ✅ Configurar índices

3. **Seguridad**

   - ✅ Cambiar `JWT_SECRET` por uno seguro
   - ✅ Configurar `CORS_ORIGIN` específico
   - ✅ Habilitar HTTPS
   - ✅ Configurar rate limiting apropiado

4. **Monitoreo**

   - ✅ Configurar logging
   - ✅ Monitorear uso de APIs
   - ✅ Alertas de errores

### 📦 Build para Producción

```bash
# Instalar dependencias de producción
npm install --production

# Iniciar servidor
npm start
```

### 📖 Guía Completa de Despliegue

Para instrucciones detalladas paso a paso, configuración de cada plataforma, troubleshooting y mejores prácticas, ver **[DEPLOY.md](./DEPLOY.md)**

---

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test
```

---

## 📝 Licencia

ISC

---

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

Para problemas o preguntas:

- 📧 Abre un issue en GitHub
- 📖 Revisa la documentación
- 🔍 Busca en issues existentes

---

<div align="center">

**Hecho con ❤️ para los amantes del cine**

🎬 **LaPremier** - Tu plataforma de cines favorita

</div>
