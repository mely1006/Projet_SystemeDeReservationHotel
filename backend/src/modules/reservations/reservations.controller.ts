import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll(
    @Query('statut') statut?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.reservationsService.findAll(statut, dateDebut, dateFin);
  }

  @Get('stats')
  getStats() {
    return this.reservationsService.getStats();
  }

  @Get('check-ins-today')
  getCheckInsToday() {
    return this.reservationsService.getCheckInsToday();
  }

  @Get('check-outs-today')
  getCheckOutsToday() {
    return this.reservationsService.getCheckOutsToday();
  }

  @Get('chambre/:chambreId')
  getReservationsParChambre(
    @Param('chambreId', ParseIntPipe) chambreId: number,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.reservationsService.getReservationsParChambre(
      chambreId,
      dateDebut,
      dateFin,
    );
  }

  @Get('client/:clientId')
  getReservationsParClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.reservationsService.getReservationsParClient(clientId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.remove(id);
  }

  @Get(':chambreId/disponibilite')
  checkDisponibilite(
    @Param('chambreId', ParseIntPipe) chambreId: number,
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.reservationsService.checkDisponibilite(
      chambreId,
      new Date(dateDebut),
      new Date(dateFin),
    );
  }
}