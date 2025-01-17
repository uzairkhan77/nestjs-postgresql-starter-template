// Nest JS
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm'

// Utils
import { ConfigModule } from '../config.module'

export class TypeORMConfig {
    static getPostgreSQLConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            username: configService.get('database.username'),
            password: configService.get('database.password'),
            database: configService.get('database.database'),
            synchronize: false,
            logging: false,
            entities: ['dist/**/*.entity.js'],
            ssl: { rejectUnauthorized: false },
            migrations: ['dist/src/database/*.js'],
        }
    }
}

export const PostgreSQLConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleAsyncOptions> =>
        TypeORMConfig.getPostgreSQLConfig(configService),
    inject: [ConfigService],
}
