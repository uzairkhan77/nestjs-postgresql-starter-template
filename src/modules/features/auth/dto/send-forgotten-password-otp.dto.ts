import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class SendForgottenPasswordOtpDto {
    @ApiProperty({
        example: 'johndoe@email.com',
        description: 'Email of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string
}
