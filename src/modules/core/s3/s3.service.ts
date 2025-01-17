import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

@Injectable()
export class S3Service {
    private readonly region: string
    private readonly bucketName: string
    private readonly s3Client: S3Client

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get<string>('s3.region')
        this.bucketName = this.configService.get<string>('s3.bucketName')
        this.s3Client = new S3Client({ region: this.region })
    }

    async upload(fileName: string, file: Buffer | Readable): Promise<string> {
        const filepath = `temp/${fileName}`

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: filepath,
                    Body: file,
                }),
            )

            // Construct the file URL for S3
            const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filepath}`
            return url
        } catch (error) {
            throw new Error(`Failed to upload file to S3: ${error.message}`)
        }
    }
}
