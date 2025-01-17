import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/src/database/*.js'],
    logging: true,
})

export default AppDataSource
