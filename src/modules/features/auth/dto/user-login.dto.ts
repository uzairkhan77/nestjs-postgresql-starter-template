import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserLoginDTO {
    @ApiProperty({
        example: 'johndoe@email.com',
        description: 'Email of the user',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: '123123',
        description: 'Password of the user',
    })
    @IsString()
    @IsNotEmpty()
    password: string
}
