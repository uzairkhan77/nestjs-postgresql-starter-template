// NestJS
import { Module } from '@nestjs/common'

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm'

// Entities
import { User } from './entity/user.entity'
import { Otp } from './entity/otp.entity'
import { OrganizationRole } from './entity/organization-role.entity'

// Strategies
import { JwtStrategy } from './strategy/jwt.strategy'

// Modules
import { UsersModule } from '../users/users.module'
import { JwtModule } from 'src/modules/core/jwt/jwt.module'

// Services
import { MailService } from 'src/modules/core/mail/mail.service'
import { AuthService } from './auth.service'

// Controllers
import { AuthController } from './auth.controller'

@Module({
    imports: [TypeOrmModule.forFeature([User, Otp, OrganizationRole]), UsersModule, JwtModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, MailService],
    exports: [AuthService],
})
export class AuthModule {}
