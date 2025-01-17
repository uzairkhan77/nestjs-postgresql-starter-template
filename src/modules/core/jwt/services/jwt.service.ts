import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService as NestJwtService } from '@nestjs/jwt'
import { JWT } from '../types'

@Injectable()
export class JwtService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateUserAuthToken(payload: JWT): Promise<string> {
        const secrets = {
            secret: this.configService.getOrThrow<string>('JWT_SECRET'),
            expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRY'),
        }
        const token = this.jwtService.sign(payload, secrets)
        return token
    }

    async verifyUserAuthToken(token: string): Promise<JWT> {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        })
    }

    decodeToken(token: string): string | null {
        return this.jwtService.decode(token)
    }
}
