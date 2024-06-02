export default {
  "type": process.env.DB_TYPE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "synchronize": true,
  "logging": false,
  "entities": ["src/entity/**/*.js"],
  "migrations": ["src/migration/**/*.js"],
  "subscribers": ["src/subscriber/**/*.js"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
};