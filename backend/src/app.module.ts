import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { ClientsModule } from './modules/clients/clients.module';
import { ChambresModule } from './modules/chambres/chambres.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaiementsModule } from './modules/paiements/paiements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ClientsModule,
    ChambresModule,
    ReservationsModule,
    PaiementsModule,
  ],
})
export class AppModule {}