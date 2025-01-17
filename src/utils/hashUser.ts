import { compare, hash } from 'bcrypt'

export const hashAndValidatePassword = async (password: string, saltRounds: number): Promise<string> => {
    return hash(password, saltRounds)
}

export const verify = async (password: string, hashPassword: string): Promise<boolean> => {
    if (!hashPassword) {
        return false
    }
    return compare(password, hashPassword)
}
