import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationModule } from './application/application.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.MAIL_PORT || 2525,
        auth: {
          user: process.env.MAIL_USER_NAME || '8718fdd6c06f18',
          pass: process.env.MAIL_PASS || 'db6ac66abe968f',
        },
      },
      defaults: {
        from: '"Job Board" <noreply@jobboard.com>',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.USER_NAME || 'root',
      password: process.env.PASSWORD || 'root',
      database: process.env.DATABASE || 'jobboard',
      autoLoadEntities: !!process.env.AUTO_LOAD_ENTITIES || true,
      synchronize: !!process.env.SYNCHRONIZE || true,
    }),
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
