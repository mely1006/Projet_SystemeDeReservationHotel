import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Chambre } from './chambre.entity';
import { CreateChambreDto, UpdateChambreDto } from './dto/chambre.dto';

@Injectable()
export class ChambresService {
  constructor(
    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,
  ) {}

  async create(createChambreDto: CreateChambreDto): Promise<Chambre> {
    const existingChambre = await this.chambreRepository.findOne({
      where: { numero: createChambreDto.numero },
    });

    if (existingChambre) {
      throw new ConflictException('Une chambre avec ce numéro existe déjà');
    }

    const chambre = this.chambreRepository.create(createChambreDto);
    return await this.chambreRepository.save(chambre);
  }

  async findAll(
    statut?: string,
    type?: string,
    etage?: number,
  ): Promise<Chambre[]> {
    const query = this.chambreRepository.createQueryBuilder('chambre');

    if (statut) {
      query.andWhere('chambre.statut = :statut', { statut });
    }

    if (type) {
      query.andWhere('chambre.type = :type', { type });
    }

    if (etage) {
      query.andWhere('chambre.etage = :etage', { etage });
    }

    query.orderBy('chambre.numero', 'ASC');

    return await query.getMany();
  }

  async findOne(id: number): Promise<Chambre> {
    const chambre = await this.chambreRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });

    if (!chambre) {
      throw new NotFoundException(`Chambre avec l'ID ${id} non trouvée`);
    }

    return chambre;
  }

  async update(id: number, updateChambreDto: UpdateChambreDto): Promise<Chambre> {
    const chambre = await this.findOne(id);

    if (updateChambreDto.numero && updateChambreDto.numero !== chambre.numero) {
      const existingChambre = await this.chambreRepository.findOne({
        where: { numero: updateChambreDto.numero },
      });

      if (existingChambre) {
        throw new ConflictException('Une chambre avec ce numéro existe déjà');
      }
    }

    Object.assign(chambre, updateChambreDto);
    return await this.chambreRepository.save(chambre);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chambreRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chambre avec l'ID ${id} non trouvée`);
    }
  }

  async findDisponibles(dateDebut: Date, dateFin: Date): Promise<Chambre[]> {
    const chambres = await this.chambreRepository
      .createQueryBuilder('chambre')
      .leftJoinAndSelect('chambre.reservations', 'reservation')
      .where('chambre.statut = :statut', { statut: 'disponible' })
      .andWhere(
        `(reservation.id IS NULL OR 
         NOT (reservation.dateDebut < :dateFin AND reservation.dateFin > :dateDebut AND reservation.statut IN ('confirmee', 'en_cours')))`,
        { dateDebut, dateFin },
      )
      .getMany();

    return chambres;
  }

  async getStats(): Promise<any> {
    const total = await this.chambreRepository.count();
    const disponibles = await this.chambreRepository.count({
      where: { statut: 'disponible' },
    });
    const occupees = await this.chambreRepository.count({
      where: { statut: 'occupee' },
    });
    const maintenance = await this.chambreRepository.count({
      where: { statut: 'maintenance' },
    });

    const tauxOccupation = total > 0 ? ((occupees / total) * 100).toFixed(2) : 0;

    return {
      total,
      disponibles,
      occupees,
      maintenance,
      tauxOccupation,
    };
  }
}