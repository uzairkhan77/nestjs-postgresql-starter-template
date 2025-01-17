// Nest JS
import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'

// Services
import { UploadService } from './upload.service'

@Controller({
    path: 'upload',
    version: '1',
})
@ApiTags('Upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @ApiOperation({ summary: 'Upload media files' })
    @Post('media')
    @UseInterceptors(FilesInterceptor('files', 10))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'The media to upload (10 max at once)',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    uploadImages(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 10 * 1024 * 1024,
                        message(maxSize): string {
                            return `File size should be less than ${maxSize / (1024 * 1024)} MB `
                        },
                    }),
                    new FileTypeValidator({
                        fileType: /^(image\/(jpeg|png|gif|webp)|application\/pdf)$/,
                    }),
                ],
            }),
        )
        files: Express.Multer.File[],
    ): ReturnType<typeof this.uploadService.uploadMediaFiles> {
        return this.uploadService.uploadMediaFiles(files)
    }
}
