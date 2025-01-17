// NestJS
import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common'

// Swagger
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'

// Modules
import { AppModule } from './app.module'

// Pipes
import { ValidationPipe } from './utils/pipes/validation.pipe'

// Types
import { IAuthorizationHeader } from './types/types'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)

    app.enableVersioning({
        type: VersioningType.URI,
    })

    // Swagger Configration
    const config = new DocumentBuilder()
        .setTitle('Lawyers App')
        .setDescription('Lawyers App backend made with Postgresql and Nest js')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            IAuthorizationHeader.BEARER,
        )
        .build()

    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
    // Apply the ClassSerializerInterceptor globally
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    // Validation Enabled for all DTOs
    app.useGlobalPipes(new ValidationPipe())
    const theme = new SwaggerTheme()

    const options = {
        customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
        swaggerOptions: {
            persistAuthorization: true,
        },
    }

    const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('docs', app, documentFactory, options)

    await app.listen(process.env.PORT || 8080)
}

bootstrap()
