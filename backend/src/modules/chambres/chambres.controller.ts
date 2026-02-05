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
import { ChambresService } from './chambres.service';
import { CreateChambreDto, UpdateChambreDto } from './dto/chambre.dto';

@Controller('chambres')
export class ChambresController {
  constructor(private readonly chambresService: ChambresService) {}

  @Post()
  create(@Body() createChambreDto: CreateChambreDto) {
    return this.chambresService.create(createChambreDto);
  }

  @Get()
  findAll(
    @Query('statut') statut?: string,
    @Query('type') type?: string,
    @Query('etage') etage?: string,
  ) {
    return this.chambresService.findAll(
      statut,
      type,
      etage ? parseInt(etage) : undefined,
    );
  }

  @Get('stats')
  getStats() {
    return this.chambresService.getStats();
  }

  @Get('disponibles')
  findDisponibles(
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.chambresService.findDisponibles(
      new Date(dateDebut),
      new Date(dateFin),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chambresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChambreDto: UpdateChambreDto,
  ) {
    return this.chambresService.update(id, updateChambreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chambresService.remove(id);
  }
}