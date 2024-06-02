import * as dotenv from 'dotenv';
import Joi from 'joi';
import { DEFAULT_JWT_ACCESS_EXPIRATION, DEFAULT_JWT_REFRESH_EXPIRATION, DEFAULT_PORT } from '../constants/app.constant.js';

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('PROD', 'DEV').required(),
    PORT: Joi.number().default(DEFAULT_PORT),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(DEFAULT_JWT_ACCESS_EXPIRATION)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(DEFAULT_JWT_REFRESH_EXPIRATION)
      .description('days after which refresh tokens expire'),
    BASE_NAME: Joi.string().required().description('API base name'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const GlobalConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  baseName: envVars.BASE_NAME,
  db: {
    type: envVars.DB_TYPE,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
  }
};
