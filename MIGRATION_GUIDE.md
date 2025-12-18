# Guía de Migración a MongoDB

Esta guía explica cómo migrar de JSON Server a MongoDB.

## Cambios Principales

### IDs de Documentos

**Antes (JSON Server):**
- IDs numéricos: `1`, `2`, `3`, etc.
- Campo `id` explícito en cada documento

**Ahora (MongoDB):**
- ObjectIds de MongoDB: `507f1f77bcf86cd799439011`
- Campo `_id` automático (también accesible como `id` en JSON)
- Los IDs antiguos se pierden en la migración

### Referencias entre Documentos

Los campos `movieId` en cinemas y `cinemaId` en movies mantienen los valores numéricos originales del JSON, pero estos ya no corresponden a los nuevos ObjectIds de MongoDB.

**Solución recomendada:** Actualizar el frontend para usar los nuevos ObjectIds de MongoDB, o implementar un sistema de mapeo de IDs.

## Pasos de Migración

### 1. Preparar MongoDB

Asegúrate de que MongoDB esté corriendo:

```bash
# MongoDB local
mongod

# O verifica que MongoDB esté accesible
mongosh mongodb://localhost:27017
```

### 2. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env`:

```env
PORT=5005
NODE_ENV=development
CORS_ORIGIN=*
MONGODB_URI=mongodb://localhost:27017/lapremier
```

### 3. Ejecutar Migración

```bash
npm run migrate
```

El script:
- Conecta a MongoDB
- Lee `db.json`
- Limpia las colecciones existentes (cinemas, movies, reviews)
- Importa todos los datos
- Muestra estadísticas

### 4. Verificar Migración

Puedes verificar los datos usando MongoDB Compass o mongosh:

```bash
mongosh mongodb://localhost:27017/lapremier

# Verificar conteos
db.cinemas.countDocuments()
db.movies.countDocuments()
db.reviews.countDocuments()

# Ver algunos documentos
db.cinemas.find().limit(1)
db.movies.find().limit(1)
db.reviews.find().limit(1)
```

### 5. Iniciar el Servidor

```bash
npm run dev
```

El servidor debería conectarse a MongoDB y estar listo para recibir peticiones.

## Cambios en el Frontend

### IDs como Strings

El frontend ahora recibirá ObjectIds como strings. Asegúrate de que el código maneje IDs como strings en lugar de números:

**Antes:**
```javascript
const movieId = 1; // número
cinemas.filter(c => c.movieId.includes(Number(movieId)))
```

**Ahora:**
```javascript
const movieId = "507f1f77bcf86cd799439011"; // string ObjectId
cinemas.filter(c => c.movieId.includes(movieId))
```

### Referencias entre Documentos

Los campos `movieId` y `cinemaId` mantienen los valores numéricos originales, pero estos ya no corresponden a los ObjectIds reales. Necesitarás actualizar la lógica de filtrado para usar los nuevos ObjectIds.

## Estructura de Datos en MongoDB

### Cinema
```javascript
{
  _id: ObjectId("..."),
  movieId: [1, 2, 3], // IDs numéricos originales (necesitan actualización)
  name: "Cine Callao",
  address: { ... },
  // ... otros campos
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Movie
```javascript
{
  _id: ObjectId("..."),
  cinemaId: [1, 2], // IDs numéricos originales (necesitan actualización)
  title: { original: "...", spanish: "..." },
  // ... otros campos
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Review
```javascript
{
  _id: ObjectId("..."),
  movieId: 2, // ID numérico original (necesita actualización)
  rating: 5,
  comment: "...",
  user: "...",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## Solución para Referencias

Para mantener las referencias funcionando, tienes dos opciones:

### Opción 1: Actualizar Referencias en el Script de Migración

Modificar `scripts/migrateToMongoDB.js` para crear un mapeo de IDs antiguos a nuevos ObjectIds y actualizar todas las referencias.

### Opción 2: Usar Referencias de MongoDB

Cambiar los modelos para usar referencias de Mongoose (`ref`) en lugar de arrays de números.

## Rollback

Si necesitas volver a JSON Server:

1. Detén el servidor MongoDB
2. Restaura `app.js` a la versión anterior con JSON Server
3. El archivo `db.json` original se mantiene intacto

## Producción

Para producción, usa una conexión MongoDB segura:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lapremier?retryWrites=true&w=majority
```

Asegúrate de:
- Configurar autenticación en MongoDB
- Usar variables de entorno seguras
- Configurar backups regulares
- Monitorear el rendimiento

