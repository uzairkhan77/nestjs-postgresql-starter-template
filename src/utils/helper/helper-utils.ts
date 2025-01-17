import * as crypto from 'crypto'
import { User } from 'src/modules/features/auth/entity/user.entity'

/**
 * Generate a cryptographically secure random 6-digit OTP.
 */
export const generateRandomOtp = (): number => {
    const randomBytes = crypto.randomBytes(4) // Generate 4 random bytes
    const randomNumber = parseInt(randomBytes.toString('hex'), 16) // Convert to a number
    return 100000 + (randomNumber % 900000) // Ensure a 6-digit OTP
}

/**
 * Calculate expiry time for OTP in minutes.
 */
export const calculateExpiryTime = (minutes: number): Date => {
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + minutes)
    return expiry
}

/**
 * Replace spaces with hyphens in a url.
 */
export const makeURLFriendly = (url: string): string => {
    return url.replace(/\s+/g, '-').toLowerCase()
}

/**
 * Utility function to sanitize a User object.
 * @param user - The User entity to sanitize.
 * @returns A sanitized version of the User object without sensitive fields (like password).
 */
export function sanitizeUser(user: User): Partial<User> {
    return { ...user, password: undefined }
}
