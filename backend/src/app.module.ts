import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { ScheduleModule } from '@nestjs/schedule'; // AJOUTER
import { ServeStaticModule } from '@nestjs/serve-static'; // AJOUTER
import { join } from 'path'; // AJOUTER

// Modules existants
import { ClientsModule } from './modules/clients/clients.module';
import { ChambresModule } from './modules/chambres/chambres.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaiementsModule } from './modules/paiements/paiements.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// NOUVEAUX MODULES
import { EmailModule } from './modules/email/email.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(), // AJOUTER
    ServeStaticModule.forRoot({  // AJOUTER
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    // Modules existants
    ClientsModule,
    ChambresModule,
    ReservationsModule,
    PaiementsModule,
    DashboardModule,
    
    // NOUVEAUX MODULES
    EmailModule,
    NotificationsModule,
    UploadModule,
  ],
})
export class AppModule {}
