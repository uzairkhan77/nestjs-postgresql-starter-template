// Nest js
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Controllers
import { AppController } from './app.controller'

// Services
import { AppService } from './app.service'

// Modules
import { JwtModule } from './modules/core/jwt/jwt.module'
import { AuthModule } from './modules/features/auth/auth.module'
import { ConfigModule } from './modules/core/config/config.module'
import { UsersModule } from './modules/features/users/users.module'
import { PostgreSQLConfig } from './modules/core/config/database/orm.config'
import { UploadModule } from './modules/core/upload/upload.module'
@Module({
    imports: [
        TypeOrmModule.forRootAsync(PostgreSQLConfig),
        ConfigModule,
        AuthModule,
        JwtModule,
        UsersModule,
        UploadModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
