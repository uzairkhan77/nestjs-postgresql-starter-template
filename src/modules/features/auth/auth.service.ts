// Nest JS
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'

// TypeORM
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

// Entities
import { User } from './entity/user.entity'
import { OrganizationRole } from './entity/organization-role.entity'
import { Otp } from './entity/otp.entity'

// Services
import { JwtService } from 'src/modules/core/jwt/services/jwt.service'
import { UsersService } from '../users/users.service'
import { MailService } from 'src/modules/core/mail/mail.service'

// DTOs
import { UserRegisterDTO } from './dto/user-register.dto'
import { AddOrganizationDetailsDTO } from './dto/add-organization-details'
import { UserLoginDTO } from './dto/user-login.dto'
import { ResetForgottenPasswordDto } from './dto/reset-forgotten-password.dto'
import { VerifyForgottenPasswordOtpDto } from './dto/verify-forgotten-password-otp.dto'

// Types and Enums
import { AuthResponse } from 'src/modules/core/jwt/types'
import { OtpPurpose, ProfileStatus, UserRoles } from 'src/types/enums/user.enum'

// Utils
import { comparePassword, hashPassword } from 'src/utils/hashing/bcrypt'
import { generateRandomOtp, sanitizeUser } from 'src/utils/helper/helper-utils'

// Email Templates
import verifyEmailTemplate from 'src/modules/core/mail/template/verify-email'
import forgotPasswordTemplate from 'src/modules/core/mail/template/forgot-password'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private mailerService: MailService,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
        @InjectRepository(OrganizationRole)
        private organizationRoleRepository: Repository<OrganizationRole>,
    ) {}

    /**
     * Registers a new user and returns their profile and JWT token.
     * @param data RegisterUserDTO
     * @returns Promise<AuthResponse>
     */
    async register(data: UserRegisterDTO): Promise<AuthResponse> {
        try {
            // Check if the email already exists
            const existingUser = await this.usersService.findByEmail(data.email)
            if (existingUser) {
                throw new ConflictException('Email is already in use.')
            }
            // Create a new user
            const password = hashPassword(data.password)
            // Store user's last login time
            const lastLoginAt = new Date()
            const payload = {
                ...data,
                password,
                lastLoginAt,
                role: UserRoles.USER,
            }
            const user = await this.usersService.createUser(payload)

            // Generate OTP for verification
            const otp = await this.generateOtp(user, OtpPurpose.VERIFICATION)
            // Send mail to user's mail
            const mailOptions = {
                to: user.email,
                subject: 'Verify Your Email',
                html: verifyEmailTemplate(user.email, otp),
            }
            const emailRes = await this.mailerService.sendMail(mailOptions)
            console.log({ emailRes })
            // Generate and return user with token
            const generatedTokenAndUser = await this.generateUserJWT(user)
            return { message: 'User registered successfully', ...generatedTokenAndUser }
        } catch (error) {
            console.log({ error })
            throw error
        }
    }

    /**
     * Logs in a user and returns their profile and JWT token.
     * @param data LoginDTO
     * @returns Promise<AuthResponse>
     */
    async userLogin(data: UserLoginDTO): Promise<AuthResponse> {
        try {
            const user = await this.usersService.findByEmail(data.email)
            if (!user) {
                throw new UnauthorizedException('Invalid credentials.')
            }
            // Admin cant login
            if (user.role !== UserRoles.USER) {
                throw new ForbiddenException('You are not authorized to perform this action.')
            }
            //  If user has been deactivated by admin
            if (user.deactivatedAt) {
                throw new UnauthorizedException('Your account has been deactivated by admin.')
            }
            // Check if the provided password is valid
            const isPasswordValid = comparePassword(data.password, user.password)
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials.')
            }
            // Store user's last login time
            user.lastLoginAt = new Date()
            const savedUser = await this.usersService.save(user)
            console.log(savedUser)
            // Generate OTP for unverified users
            if (user.profileStatus === ProfileStatus.UNVERIFIED) {
                const otp = await this.generateOtp(user, OtpPurpose.VERIFICATION)
                // Send mail to user's mail
                const mailOptions = {
                    to: user.email,
                    subject: 'Verify Your Email',
                    html: verifyEmailTemplate(user.email, otp),
                }
                await this.mailerService.sendMail(mailOptions)
            }

            const generatedTokenAndUser = await this.generateUserJWT(user)
            return { message: 'User logged in successfully', ...generatedTokenAndUser }
        } catch (error) {
            console.log({ error })
            throw error
        }
    }

    /**
     * @description create admin user
     * @param data RegisterUserDTO
     * @returns Promise<AuthResponse>
     */
    async createAdmin(data: UserRegisterDTO): Promise<AuthResponse> {
        try {
            // Check if the email already exists
            const existingUser = await this.usersService.findByEmail(data.email)
            if (existingUser) {
                throw new ConflictException('Email is already in use.')
            }
            // Create a new user
            const password = hashPassword(data.password)
            // Store user's last login time
            const lastLoginAt = new Date()
            const payload = {
                ...data,
                password,
                lastLoginAt,
                role: UserRoles.ADMIN,
                profileStatus: ProfileStatus.VERIFIED,
            }
            const user = await this.usersService.createUser(payload)
            // Generate and return user with token

            const generatedTokenAndUser = await this.generateUserJWT(user)
            return { message: 'Admin created successfully', ...generatedTokenAndUser }
        } catch (error) {
            console.log({ error })
            throw error
        }
    }

    /**
     * Logs in an admin and returns their profile and JWT token.
     * @param data LoginDTO
     * @returns Promise<AuthResponse>
     */
    async adminLogin(data: UserLoginDTO): Promise<AuthResponse> {
        console.log({ data })
        try {
            const user = await this.usersService.findByEmail(data.email)
            if (!user) {
                throw new UnauthorizedException('Invalid credentials.')
            }
            // user cant login
            if (user.role !== UserRoles.ADMIN) {
                throw new ForbiddenException('You are not authorized to perform this action.')
            }
            // Check if the provided password is valid
            const isPasswordValid = comparePassword(data.password, user.password)
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials.')
            }

            const generatedTokenAndUser = await this.generateUserJWT(user)
            return { message: 'Admin logged in successfully', ...generatedTokenAndUser }
        } catch (error) {
            console.log({ error })
            throw error
        }
    }

    /**
     * @param user
     * @type {User}
     * @returns user
     * @description Fetch user's own profile using token
     */
    async getMyProfile(user: User): Promise<User> {
        // fetch the user's profile
        const userProfile = await this.usersService.findById(user.id)
        // If no profile is found
        if (!userProfile) {
            throw new NotFoundException(`User profile not found.`)
        }
        return userProfile
    }

    /**
     * Verifies a user's account by validating the provided OTP and updating their status.
     * @param userId string - The user's ID
     * @param otpValue number - The OTP to validate
     * @returns Promise<string> - Confirmation message
     */
    async verifyUserAccount(userId: string, otpValue: number): Promise<{ message: string }> {
        // Fetch the user
        const user = await this.usersService.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found.')
        }
        // Validate OTP
        await this.validateOtp(user, otpValue, OtpPurpose.VERIFICATION)

        // Update user's profile status to VERIFIED
        user.profileStatus = ProfileStatus.VERIFIED
        await this.usersService.save(user)

        return { message: 'Your account has been successfully verified.' }
    }

    /**
     * Resend Account Verification OTP
     */
    async resendProfileVerificationOtp(user: User): Promise<{ message: string }> {
        try {
            // Generate OTP for the user and purpose
            const otp = await this.generateOtp(user, OtpPurpose.VERIFICATION)
            // Send mail to user's mail
            const mailOptions = {
                to: user.email,
                subject: 'Verify Your Email',
                html: verifyEmailTemplate(user.email, otp),
            }
            await this.mailerService.sendMail(mailOptions)
            //
            return { message: 'A new OTP has been sent to your email.' }
        } catch (error) {
            // Handle any errors and throw appropriate BadRequestException
            console.error('Error generating OTP:', error)
            throw new BadRequestException('An error occurred while resending OTP. Please try again later.')
        }
    }

    /**
     * Send forgotten password OTP to the user's email.
     */
    async sendForgottenPasswordOtp(email: string): Promise<{ message: string }> {
        // Fetch the user based on the provided email
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('Account with this email does not exist')
        }
        try {
            // Generate OTP for the user with the purpose of password reset
            const otpValue = await this.generateOtp(user, OtpPurpose.RESET_PASSWORD)
            // Send mail to user's mail
            const mailOptions = {
                to: user.email,
                subject: 'Reset Your Your Password',
                html: forgotPasswordTemplate(user.email, otpValue),
            }
            await this.mailerService.sendMail(mailOptions)
            //
            // Replace this with the actual sending logic, for example:
            console.log(`OTP sent to ${user.email}: ${otpValue}`)
            // Return success message
            return { message: 'A password reset OTP has been sent to your email.' }
        } catch (error) {
            console.error('Error sending forgotten password OTP:', error)
            throw new NotFoundException('An error occurred while sending OTP. Please try again later.')
        }
    }

    /**
     * Verify the user's forgotten password OTP
     */
    async verifyForgottenPasswordOtp({ email, otp }: VerifyForgottenPasswordOtpDto): Promise<{ message: string }> {
        // Find the user by email
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('Account with this email does not exist.')
        }

        // Call validateOtp to verify the OTP
        await this.validateOtp(user, otp, OtpPurpose.RESET_PASSWORD)

        // Return success message
        return {
            message: 'OTP verified successfully.',
        }
    }

    /**
     * Reset the user's forgotten password.
     */
    async resetForgottenPassword({ email, otp, newPassword }: ResetForgottenPasswordDto): Promise<{ message: string }> {
        // Find the user by email
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('Account with this email does not exist.')
        }

        // Validate the OTP for the given user and purpose
        await this.validateOtp(user, otp, OtpPurpose.RESET_PASSWORD)

        // Hash the new password before saving it
        const hashedPassword = hashPassword(newPassword)

        // Update the user's password in the database
        user.password = hashedPassword
        await this.usersService.save(user)

        return { message: 'Password reset successfully.' }
    }

    /**  */
    /**
     * Onboard a user with organization details and role
     */
    async addOrganizationDetails(
        user: User,
        AddOrganizationDetailsDTO: AddOrganizationDetailsDTO,
    ): Promise<{ onboardedUser: User; message: string }> {
        try {
            if (user.isOnboarded) {
                throw new BadRequestException('User is already onboarded')
            }
            // Retrieve the organization role based on the provided UUID
            const organizationRole = await this.organizationRoleRepository.findOne({
                where: {
                    id: AddOrganizationDetailsDTO.organizationRole,
                },
            })

            // If the organization role is not found, throw an exception
            if (!organizationRole) {
                throw new NotFoundException('Organization Role not found')
            }

            // Update the user's organization details
            user.organizationName = AddOrganizationDetailsDTO.organizationName
            user.organizationRole = organizationRole
            user.isOnboarded = true // Mark user as onboarded

            // Save the updated user entity in the database
            const onboardedUser = await this.usersService.save(user)
            return {
                onboardedUser: onboardedUser,
                message: 'Organization details added successfully',
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Validate and delete OTP for a user and purpose.
     */
    async validateOtp(user: User, otpValue: number, purpose: OtpPurpose): Promise<void> {
        // Fetch the latest OTP for the user and purpose
        console.log({ user, userId: user.id, purpose })

        const otp = await this.otpRepository.findOne({
            where: {
                user: { id: user.id },
                purpose,
            },
            order: { createdAt: 'DESC' },
        })

        if (!otp) {
            throw new BadRequestException('OTP not found.')
        }

        // Check if the OTP matches
        if (otp.value !== otpValue) {
            throw new BadRequestException('Invalid OTP.')
        }

        // Check if the OTP has expired
        if (otp.expiresAt && otp.expiresAt < new Date()) {
            throw new BadRequestException('OTP has expired.')
        }

        // Set the usedAt timestamp to mark the OTP as used
        otp.usedAt = new Date()
        await this.otpRepository.save(otp)
    }

    /**
     * Generate an OTP for a user and purpose.
     * Deletes any existing OTP for the same user and purpose before creating a new one.
     */
    async generateOtp(user: User, purpose: OtpPurpose): Promise<number> {
        // Delete any existing OTPs for this user and purpose
        await this.otpRepository.delete({ user, purpose })

        const otpValue = generateRandomOtp()

        // Expiration time (5 minutes from now)
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 5)

        const otp = this.otpRepository.create({
            value: otpValue,
            purpose,
            expiresAt,
            user,
        })
        await this.otpRepository.save(otp)
        return otpValue
    }

    /**
     *
     * @param user @type {User}
     * @returns user and token
     * @description Generate JWT token for user and returns
     **/
    async generateUserJWT(user: User): Promise<{ user: Partial<User>; token: string }> {
        const token = await this.jwtService.generateUserAuthToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })
        const sanitizedUser = sanitizeUser(user)
        return { user: sanitizedUser, token }
    }
}
