import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class VerifyUserProfileDTO {
    @ApiProperty({
        example: '667788',
        description: 'otp sent to users mail',
    })
    @IsNotEmpty()
    @IsNumber()
    otp: number
}
