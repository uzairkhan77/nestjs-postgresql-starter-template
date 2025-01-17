import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ICustomRequest } from 'src/types/types'

export const ExtractUserFromRequest = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    // Switch to the HTTP context
    const request = ctx.switchToHttp().getRequest<ICustomRequest>() // Ensure we use the right type for the request
    return request.user // Extract user from the request
})
