import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PaginationDto {
    /**
     * The number of items to be returned per page.
     *
     * @example 10
     */
    @ApiProperty({
        description: 'The number of items per page. (dont add limit parameter if you want all data)',
        example: 10,
        required: false,
    })
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    limit: number = 10

    /**
     * The offset or starting index for pagination.
     *
     * This value determines where to start retrieving the records from.
     *
     */
    @ApiProperty({
        description: 'The offset or starting index for pagination. (dont add offset parameter if you want all data)',
        example: 0,
        required: false,
    })
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    offset: number = 0
}
