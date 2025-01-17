import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { isUUID } from 'class-validator'

@Injectable()
export class ValidateUUIDPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        if (!isUUID(value)) {
            throw new BadRequestException('Invalid ID provided')
        }
        return value
    }
}
