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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post ()
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      console.log('Données reçues:', createClientDto);
      const client = await this.clientsService.create(createClientDto);
      console.log('Client créé:', client);
      return client;
    } catch (error) {
      console.error('Erreur dans le contrôleur:', error);
      throw new HttpException(
        error.message || 'Erreur lors de la création du client',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('statut') statut?: string,
  ) {
    return this.clientsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      statut,
    );
  }

  @Get('stats')
  getStats() {
    return this.clientsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }

  @Patch(':id/update-statut')
  updateStatut(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.updateStatut(id);
  }
}