import { User } from 'src/modules/features/auth/entity/user.entity'
import { UserRoles } from 'src/types/enums/user.enum'

export interface JWT {
    id: string
    email: string
    role: UserRoles
}

/**
 * AuthResponse
 * Represents the structure for authentication responses
 */
export type AuthResponse = {
    user: Partial<User>
    token: string
    message: string
}
