import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';

@Module({
  providers: [MailService]
})
export class MailModule {}
