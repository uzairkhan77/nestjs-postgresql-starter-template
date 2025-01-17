// Nest JS
import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Services
import { AuthService } from './auth.service'

// Entities
import { User } from './entity/user.entity'
import { JwtAuthGuard } from 'src/utils/guards/auth.guard'

// Types And Enums
import { UserRoles } from 'src/types/enums/user.enum'
import { IAuthorizationHeader } from 'src/types/types'

// Decorators
import { ExtractUserFromRequest } from 'src/utils/decorators/user-extractor.decorator'
import { Roles } from 'src/utils/decorators/roles.decorator'

// Guards
import { AddOrganizationDetailsDTO } from './dto/add-organization-details'
import { RolesGuard } from 'src/utils/guards/roles.guard'

// DTOs
import { UserLoginDTO } from './dto/user-login.dto'
import { UserRegisterDTO } from './dto/user-register.dto'
import { ResetForgottenPasswordDto } from './dto/reset-forgotten-password.dto'
import { VerifyUserProfileDTO } from './dto/verify-user-profile.dto'
import { SendForgottenPasswordOtpDto } from './dto/send-forgotten-password-otp.dto'
import { VerifyForgottenPasswordOtpDto } from './dto/verify-forgotten-password-otp.dto'

@Controller({
    path: 'auth',
    version: '1',
})
@ApiTags('Auth - User')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User has been successfully registered.',
        type: User,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed.',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already exists.',
    })
    @ApiBody({ type: UserRegisterDTO })
    @Post('register')
    async register(@Body() data: UserRegisterDTO): ReturnType<typeof this.authService.register> {
        return await this.authService.register(data)
    }

    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User has been successfully logged in.',
        type: User,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User Unauthorized.',
    })
    @ApiBody({ type: UserLoginDTO })
    @Post('login')
    async login(@Body() data: UserLoginDTO): ReturnType<typeof this.authService.userLogin> {
        return await this.authService.userLogin(data)
    }

    @ApiOperation({ summary: "Fetch the authenticated user's profile" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully fetched user profile.',
        type: User,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User profile not found.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or missing authentication token.',
    })
    @ApiBearerAuth(IAuthorizationHeader.BEARER)
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyProfile(@ExtractUserFromRequest() user: User): ReturnType<typeof this.authService.getMyProfile> {
        const userProfile = await this.authService.getMyProfile(user)
        return userProfile
    }

    @ApiOperation({ summary: 'Verify User Account (email)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Account verified successfully.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'OTP expired or invalid.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or missing authentication token.',
    })
    @ApiBearerAuth(IAuthorizationHeader.BEARER)
    @UseGuards(JwtAuthGuard)
    @Patch('verify-account')
    async verifyUserProfile(
        @ExtractUserFromRequest() user: User,
        @Body() verifyUserProfileDTO: VerifyUserProfileDTO,
    ): ReturnType<typeof this.authService.verifyUserAccount> {
        const { otp } = verifyUserProfileDTO
        return this.authService.verifyUserAccount(user.id, otp)
    }

    @ApiOperation({ summary: 'Resend User Profile Verification OTP' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OTP resent successfully.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Profile already verified.',
    })
    @Post('resend-verification-otp')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth(IAuthorizationHeader.BEARER)
    async resendOtp(
        @ExtractUserFromRequest() user: User,
    ): ReturnType<typeof this.authService.resendProfileVerificationOtp> {
        return await this.authService.resendProfileVerificationOtp(user)
    }

    @ApiOperation({ summary: 'Send forgotten password OTP' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OTP sent successfully.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Account with this email does not exist.',
    })
    @ApiBody({ type: SendForgottenPasswordOtpDto })
    @Post('send-forgotten-password-otp')
    async sendForgottenPasswordOtp(
        @Body() SendForgottenPasswordOtpDto: SendForgottenPasswordOtpDto,
    ): ReturnType<typeof this.authService.sendForgottenPasswordOtp> {
        return await this.authService.sendForgottenPasswordOtp(SendForgottenPasswordOtpDto.email)
    }

    @ApiOperation({ summary: 'Verify forgotten password OTP' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OTP verified successfully.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Account with this email does not exist.',
    })
    @ApiBody({ type: VerifyForgottenPasswordOtpDto })
    @Post('verify-forgotten-password-otp')
    async verifyForgottenPasswordOtp(
        @Body() VerifyForgottenPasswordOtpDto: VerifyForgottenPasswordOtpDto,
    ): ReturnType<typeof this.authService.verifyForgottenPasswordOtp> {
        return await this.authService.verifyForgottenPasswordOtp(VerifyForgottenPasswordOtpDto)
    }

    @ApiOperation({ summary: 'Reset forgotten password' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Password reset successfully.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Account with this email does not exist.',
    })
    @ApiBody({ type: ResetForgottenPasswordDto })
    @Post('reset-forgotten-password')
    async resetForgottenPassword(
        @Body() ResetForgottenPasswordDto: ResetForgottenPasswordDto,
    ): ReturnType<typeof this.authService.resetForgottenPassword> {
        return await this.authService.resetForgottenPassword(ResetForgottenPasswordDto)
    }

    @ApiOperation({ summary: 'Add organization details of a user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Organization details added successfully.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Organization role does not exist',
    })
    @ApiBearerAuth(IAuthorizationHeader.BEARER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoles.USER)
    @Post('add-organization-details')
    @ApiBody({ type: AddOrganizationDetailsDTO })
    async addOrganizationDetails(
        @ExtractUserFromRequest() user: User,
        @Body() addOrganizationDetailsDTO: AddOrganizationDetailsDTO,
    ): ReturnType<typeof this.authService.addOrganizationDetails> {
        return await this.authService.addOrganizationDetails(user, addOrganizationDetailsDTO)
    }
}
