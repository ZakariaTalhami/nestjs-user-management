import { Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class EmailService {
    private emailClient: MailService;

    constructor() {
      this.emailClient = new MailService();
      this.emailClient.setApiKey(process.env.EMAIL_SERVICE_API_KEY)
    }

    async sendEmailTemplate(templateId: string, toEmail: string, data: any) {
        return this.emailClient.send({
            from: 'zakaria.a.a.talhami@gmail.com',
            to: toEmail,
            dynamicTemplateData: data,
            templateId,
        });
    }
}
