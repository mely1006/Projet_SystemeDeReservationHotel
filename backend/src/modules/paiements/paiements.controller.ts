import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PaiementsService } from './paiements.service';
import { CreatePaiementDto, UpdatePaiementDto } from './dto/paiement.dto';

@Controller('paiements')
export class PaiementsController {
  constructor(private readonly paiementsService: PaiementsService) {}

  @Post()
  create(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementsService.create(createPaiementDto);
  }

  @Get()
  findAll() {
    return this.paiementsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.paiementsService.getStats();
  }

  @Get('reservation/:reservationId')
  findByReservation(@Param('reservationId', ParseIntPipe) reservationId: number) {
    return this.paiementsService.findByReservation(reservationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paiementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaiementDto: UpdatePaiementDto,
  ) {
    return this.paiementsService.update(id, updatePaiementDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paiementsService.remove(id);
  }
}