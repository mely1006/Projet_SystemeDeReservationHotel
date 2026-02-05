import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    statut?: string,
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }> {
    const query = this.clientRepository.createQueryBuilder('client');

    if (search) {
      query.where(
        'client.nom LIKE :search OR client.prenom LIKE :search OR client.email LIKE :search OR client.telephone LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (statut) {
      query.andWhere('client.statut = :statut', { statut });
    }

    query
      .orderBy('client.dateCreation', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }
  }

  async updateStatut(id: number): Promise<Client> {
    const client = await this.findOne(id);
    
    if (client.nombreReservations >= 20) {
      client.statut = 'vip';
    } else if (client.nombreReservations >= 5) {
      client.statut = 'regulier';
    } else {
      client.statut = 'nouveau';
    }

    return await this.clientRepository.save(client);
  }

  async getStats(): Promise<any> {
    const total = await this.clientRepository.count();
    const vip = await this.clientRepository.count({ where: { statut: 'vip' } });
    const reguliers = await this.clientRepository.count({ where: { statut: 'regulier' } });
    const nouveaux = await this.clientRepository.count({ where: { statut: 'nouveau' } });

    return {
      total,
      vip,
      reguliers,
      nouveaux,
    };
  }
}