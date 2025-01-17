import { HttpException, HttpStatus } from '@nestjs/common'

export const throwHttpException = (message: string | Record<string, unknown>, status: HttpStatus): never => {
    throw new HttpException(message, status)
}
