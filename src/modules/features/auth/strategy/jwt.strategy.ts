import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { JWT } from 'src/modules/core/jwt/types'
import { User } from '../entity/user.entity'
import { UsersService } from '../../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        })
    }

    async validate(payload: JWT): Promise<User> {
        const user = await this.userService.findById(payload.id)

        if (user.deactivatedAt) {
            throw new UnauthorizedException('User has been deactivated by admin.')
        }
        return user
    }
}
