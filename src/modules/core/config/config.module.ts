import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import databaseConfig from './loaders/database.config'
import authConfig from './loaders/auth.config'
import s3Config from './loaders/s3.config'
import { validationSchema } from './validation'

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, authConfig, s3Config],
            validationSchema: validationSchema,
            envFilePath: ['.env'],
        }),
    ],
})
export class ConfigModule {}
