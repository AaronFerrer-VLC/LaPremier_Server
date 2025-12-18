# LaPremier Server

Backend API server for LaPremier application using MongoDB and Express.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- CORS configuration
- Error handling middleware
- Health check endpoint
- Request logging with Morgan
- Environment-based configuration
- Data migration script from JSON to MongoDB

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher) - running locally or remote instance

### Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running:
```bash
# Local MongoDB (default)
mongod

# Or use MongoDB Atlas (cloud)
```

3. Create a `.env` file:
```bash
# Create .env file manually or copy from example
```

4. Configure environment variables in `.env`:
```env
PORT=5005
NODE_ENV=development
CORS_ORIGIN=*
MONGODB_URI=mongodb://localhost:27017/lapremier
```

### Migration from JSON to MongoDB

If you have existing data in `db.json`, migrate it to MongoDB:

```bash
npm run migrate
```

This script will:
- Connect to MongoDB
- Read data from `db.json`
- Import all cinemas, movies, and reviews
- Show migration statistics

**Note:** The migration script will clear existing collections before importing. Comment out the cleanup section in `scripts/migrateToMongoDB.js` if you want to preserve existing data.

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5005` (or the port specified in `.env`).

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Movies
- `GET /movies` - Get all movies
  - Query params: `deleted`, `released`, `gender`
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create new movie
- `PUT /movies/:id` - Update movie
- `PATCH /movies/:id` - Partially update movie
- `DELETE /movies/:id` - Delete movie (soft delete)

### Cinemas
- `GET /cinemas` - Get all cinemas
  - Query params: `deleted`
- `GET /cinemas/:id` - Get cinema by ID
- `POST /cinemas` - Create new cinema
- `PUT /cinemas/:id` - Update cinema
- `PATCH /cinemas/:id` - Partially update cinema
- `DELETE /cinemas/:id` - Delete cinema (soft delete)

### Reviews
- `GET /reviews` - Get all reviews
  - Query params: `movieId`, `rating`
- `GET /reviews/:id` - Get review by ID
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review
- `PATCH /reviews/:id` - Partially update review
- `DELETE /reviews/:id` - Delete review

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5005` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `CORS_ORIGIN` | Allowed CORS origins (`*` for all) | `*` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/lapremier` |

## Project Structure

```
LaPremier_Server/
├── config/
│   ├── env.js          # Environment configuration
│   └── database.js     # MongoDB connection
├── controllers/
│   ├── cinemaController.js
│   ├── movieController.js
│   └── reviewController.js
├── models/
│   ├── Cinema.js       # Cinema Mongoose model
│   ├── Movie.js        # Movie Mongoose model
│   └── Review.js       # Review Mongoose model
├── routes/
│   ├── cinemas.js
│   ├── movies.js
│   └── reviews.js
├── middleware/
│   ├── cors.js         # CORS middleware
│   └── errorHandler.js # Error handling middleware
├── scripts/
│   └── migrateToMongoDB.js  # Migration script
├── app.js              # Main server file
├── package.json        # Dependencies
└── README.md           # This file
```

## Database Models

### Cinema
- Basic info: name, cover images, address, URL
- Pricing: regular, weekend, special
- Specifications: VO, 3D, accessibility
- Capacity: number of rooms and seating
- Services: array of available services
- Soft delete support

### Movie
- Titles: original and Spanish
- Metadata: poster, country, language, duration, director
- Genres: array of genres
- Casting: array of cast members with photos
- Release info: date, released status, rating, trailer
- Description: full movie description
- Soft delete support

### Review
- Rating: 1-5 stars
- Comment: review text
- User: reviewer name
- Movie reference: movieId
- Timestamps: automatic createdAt/updatedAt

## Development

The server uses Express.js with Mongoose for MongoDB operations. All API endpoints maintain backward compatibility with the previous JSON Server implementation.

For MongoDB documentation, visit: https://www.mongodb.com/docs/
For Mongoose documentation, visit: https://mongoosejs.com/

## Production Deployment

For production, make sure to:

1. Set `NODE_ENV=production` in your `.env` file
2. Use a secure MongoDB connection string (MongoDB Atlas recommended)
3. Configure proper CORS origins (avoid using `*` in production)
4. Set up MongoDB authentication
5. Use environment variables for sensitive data

Example production MongoDB URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lapremier?retryWrites=true&w=majority
```
