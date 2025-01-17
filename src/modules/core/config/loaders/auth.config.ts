import { registerAs } from '@nestjs/config'
import { UserRoles } from 'src/types/enums/user.enum'

export default registerAs('auth', () => ({
    jwt: {
        secret: process.env.JWT_SECRET || 'lawyers-service-app-secret-key',
        expiresIn: process.env.JWT_EXPIRY || '30d',
    },
    roles: {
        admin: UserRoles.ADMIN,
        user: UserRoles.USER,
    },
}))
