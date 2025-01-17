// NestJS
import { Module } from '@nestjs/common'

// Service
import { UsersService } from './users.service'

// Controller
import { UsersController } from './users.controller'

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm'

// Entity
import { User } from '../auth/entity/user.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
