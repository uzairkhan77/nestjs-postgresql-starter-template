/**
 * User Roles (for indicating user's role in user entity)
 */
export enum UserRoles {
    USER = 'user',
    ADMIN = 'admin',
}

/**
 *  Profile Status (for indicating users profile verification status in user entity)
 **/
export enum ProfileStatus {
    VERIFIED = 'verified',
    UNVERIFIED = 'unverified',
}

/**
 * OTP Purpose (for otp entity)
 */
export enum OtpPurpose {
    VERIFICATION = 'verification',
    RESET_PASSWORD = 'reset-password',
}
