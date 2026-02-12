// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { typeOrmConfig } from './config/typeorm.config';

// Modules
import { ClientsModule } from './modules/clients/clients.module';
import { ChambresModule } from './modules/chambres/chambres.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaiementsModule } from './modules/paiements/paiements.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EmailModule } from './modules/email/email.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot(typeOrmConfig),

    ScheduleModule.forRoot(),

    // ✅ CORRECTION : Servir les fichiers depuis uploads/ (avec 's')
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        fallthrough: false,
      },
    }),

    // ✅ Configuration Multer globale
    MulterModule.register({
      dest: join(process.cwd(), 'uploads', 'chambres'),
    }),

    // Modules métier
    ClientsModule,
    ChambresModule,
    ReservationsModule,
    PaiementsModule,
    DashboardModule,
    EmailModule,
    NotificationsModule,
    UploadModule,
  ],
})
export class AppModule {}