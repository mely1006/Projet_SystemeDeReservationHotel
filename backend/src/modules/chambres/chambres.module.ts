import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambresService } from './chambres.service';
import { ChambresController } from './chambres.controller';
import { Chambre } from './chambre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chambre])],
  controllers: [ChambresController],
  providers: [ChambresService],
  exports: [ChambresService],
})
export class ChambresModule {}