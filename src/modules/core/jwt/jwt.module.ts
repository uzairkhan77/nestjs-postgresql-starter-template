import { Module } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { JwtService } from './services/jwt.service'

@Module({
    imports: [NestJwtModule.register({})],
    controllers: [],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}
