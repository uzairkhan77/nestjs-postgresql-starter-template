// Nest JS
import { ApiProperty } from '@nestjs/swagger'

// Class Validator
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserRegisterDTO {
    @ApiProperty({
        example: 'User',
        description: 'Name of the user',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty({
        example: 'User',
        description: 'Name of the user',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string

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
    password: string
}
