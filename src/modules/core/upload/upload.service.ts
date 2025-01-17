// Nest
import { Injectable } from '@nestjs/common'

// Services
import { S3Service } from '../s3/s3.service'

// Utils
import { makeURLFriendly } from 'src/utils/helper/helper-utils'

@Injectable()
export class UploadService {
    constructor(private readonly s3Service: S3Service) {}

    async uploadMediaFiles(file: Express.Multer.File[]): Promise<{ urls: string[] }> {
        const uploadPromises = file.map(async file => {
            const { originalname, buffer } = file

            return this.s3Service.upload(makeURLFriendly(originalname), buffer)
        })

        const urls = await Promise.all(uploadPromises)

        return {
            urls,
        }
    }
}
