import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './reservation.entity';
import { ClientsModule } from '../clients/clients.module';
import { ChambresModule } from '../chambres/chambres.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    ClientsModule,
    ChambresModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}