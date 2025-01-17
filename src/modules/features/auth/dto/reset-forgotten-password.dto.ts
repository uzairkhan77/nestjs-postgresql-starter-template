import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ResetForgottenPasswordDto {
    @ApiProperty({
        example: 'johndoe@email.com',
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
    @IsNumber()
    otp: number

    @ApiProperty({
        example: 'newpassword123',
        description: 'New password',
    })
    @IsNotEmpty()
    @IsString()
    newPassword: string
}
