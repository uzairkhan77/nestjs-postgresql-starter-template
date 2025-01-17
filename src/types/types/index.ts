import { Request } from 'express'
import { User } from 'src/modules/features/auth/entity/user.entity'
import { UserRoles } from '../enums/user.enum'

export interface ICreateUserDTO {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: UserRoles
    lastLoginAt?: Date
}

export enum IAuthorizationHeader {
    BEARER = 'Bearer Authorization',
    BASIC = 'Authorization',
}

export interface ICustomRequest extends Request {
    user: User
}
