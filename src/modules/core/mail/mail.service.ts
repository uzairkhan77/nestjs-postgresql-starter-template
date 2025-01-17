// Nest Js
import { ConfigService } from '@nestjs/config'

// Nodemailer
import * as nodemailer from 'nodemailer'

// Types
import { MailOptions } from './types'

export class MailService {
    private transporter: nodemailer.Transporter

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            debug: true,
            logger: true,
        })
    }

    async sendMail(mailOptions: MailOptions): Promise<void> {
        const mailOptionsPayload = {
            ...mailOptions,
            from: process.env.SMTP_EMAIL,
        }

        try {
            // Attempt to send the email
            return await this.transporter.sendMail(mailOptionsPayload)
        } catch (error) {
            console.log('Error sending email:', error)
        }
    }
}
