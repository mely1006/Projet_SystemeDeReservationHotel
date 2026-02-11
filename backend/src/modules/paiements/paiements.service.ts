import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paiement } from './paiement.entity';
import { CreatePaiementDto, UpdatePaiementDto } from './dto/paiement.dto';

@Injectable()
export class PaiementsService {
  constructor(
    @InjectRepository(Paiement)
    private paiementRepository: Repository<Paiement>,
  ) {}

  async create(createPaiementDto: CreatePaiementDto): Promise<Paiement> {
    const paiement = this.paiementRepository.create(createPaiementDto);
    return await this.paiementRepository.save(paiement);
  }

  async findAll(): Promise<Paiement[]> {
    return await this.paiementRepository.find({
      relations: ['reservation', 'reservation.client', 'reservation.chambre'],
      order: { datePaiement: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Paiement> {
    const paiement = await this.paiementRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.client', 'reservation.chambre'],
    });

    if (!paiement) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
    }

    return paiement;
  }

  async findByReservation(reservationId: number): Promise<Paiement[]> {
    return await this.paiementRepository.find({
      where: { reservationId },
      order: { datePaiement: 'DESC' },
    });
  }

  async update(id: number, updatePaiementDto: UpdatePaiementDto): Promise<Paiement> {
    const paiement = await this.findOne(id);
    Object.assign(paiement, updatePaiementDto);
    return await this.paiementRepository.save(paiement);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paiementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Paiement avec l'ID ${id} non trouvé`);
    }
  }

  async getStats(): Promise<any> {
    const total = await this.paiementRepository.count();
    const valides = await this.paiementRepository.count({
      where: { statut: 'valide' },
    });
    const enAttente = await this.paiementRepository.count({
      where: { statut: 'en_attente' },
    });

    const montantTotal = await this.paiementRepository
      .createQueryBuilder('paiement')
      .select('SUM(paiement.montant)', 'total')
      .where('paiement.statut = :statut', { statut: 'valide' })
      .getRawOne();

    return {
      total,
      valides,
      enAttente,
      montantTotal: montantTotal.total || 0,
    };
  }
}