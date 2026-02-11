import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaiementsService } from './paiements.service';
import { PaiementsController } from './paiements.controller';
import { Paiement } from './paiement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement])],
  controllers: [PaiementsController],
  providers: [PaiementsService],
  exports: [PaiementsService],
})
export class PaiementsModule {}