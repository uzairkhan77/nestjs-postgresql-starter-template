import * as Joi from 'joi'

export const validationSchema = Joi.object({
    // General
    PORT: Joi.number().default(8080),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    // Database
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_LOGGING: Joi.string().valid('true', 'false'),
    DB_SYNCHRONIZE: Joi.string().valid('true', 'false'),

    // JWT Authentication
    JWT_SECRET: Joi.string(),
    JWT_EXPIRY: Joi.string(),

    // Custom
    CUSTOM: Joi.string(),
})
