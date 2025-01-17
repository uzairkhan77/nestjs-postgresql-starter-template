import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class AddOrganizationDetailsDTO {
    @ApiProperty({
        description: 'The organization name of the user',
        example: 'Xyz Organization',
    })
    @IsNotEmpty()
    @IsString()
    organizationName: string

    @ApiProperty({
        description: 'The UUID of the organization role',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsNotEmpty()
    @IsUUID()
    organizationRole: string
}
