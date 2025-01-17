import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class VerifyForgottenPasswordOtpDto {
    @ApiProperty({
        example: 'john@example.com',
        description: 'Email of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: '123456',
        description: 'OTP value',
    })
    @IsNotEmpty()
    otp: number
}
