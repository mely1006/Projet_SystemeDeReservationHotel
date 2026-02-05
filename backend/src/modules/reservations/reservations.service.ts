import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { ClientsService } from '../clients/clients.service';
import { ChambresService } from '../chambres/chambres.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private clientsService: ClientsService,
    private chambresService: ChambresService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    // Vérifier que le client existe
    await this.clientsService.findOne(createReservationDto.clientId);

    // Vérifier que la chambre existe
    const chambre = await this.chambresService.findOne(createReservationDto.chambreId);

    // Vérifier la disponibilité de la chambre
    const isAvailable = await this.checkDisponibilite(
      createReservationDto.chambreId,
      new Date(createReservationDto.dateDebut),
      new Date(createReservationDto.dateFin),
    );

    if (!isAvailable) {
      throw new ConflictException('La chambre n\'est pas disponible pour ces dates');
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(createReservationDto.dateFin) <= new Date(createReservationDto.dateDebut)) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    const reservation = this.reservationRepository.create(createReservationDto);
    const savedReservation = await this.reservationRepository.save(reservation);

    // Mettre à jour le statut de la chambre
    await this.chambresService.update(createReservationDto.chambreId, {
      statut: 'occupee',
    });

    // Mettre à jour les statistiques du client
    const client = await this.clientsService.findOne(createReservationDto.clientId);
    await this.clientsService.update(createReservationDto.clientId, {
      nombreReservations: client.nombreReservations + 1,
      depensesTotales: Number(client.depensesTotales) + Number(createReservationDto.prixTotal),
    });
    await this.clientsService.updateStatut(createReservationDto.clientId);

    return savedReservation;
  }

  async findAll(
    statut?: string,
    dateDebut?: string,
    dateFin?: string,
  ): Promise<Reservation[]> {
    const query = this.reservationRepository.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.client', 'client')
      .leftJoinAndSelect('reservation.chambre', 'chambre');

    if (statut) {
      query.andWhere('reservation.statut = :statut', { statut });
    }

    if (dateDebut && dateFin) {
      query.andWhere(
        'reservation.dateDebut >= :dateDebut AND reservation.dateFin <= :dateFin',
        { dateDebut, dateFin },
      );
    }

    query.orderBy('reservation.dateCreation', 'DESC');

    return await query.getMany();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['client', 'chambre', 'paiements'],
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    return reservation;
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Si changement de chambre, vérifier la disponibilité
    if (
      updateReservationDto.chambreId &&
      updateReservationDto.chambreId !== reservation.chambreId
    ) {
      const isAvailable = await this.checkDisponibilite(
        updateReservationDto.chambreId,
        new Date(updateReservationDto.dateDebut || reservation.dateDebut),
        new Date(updateReservationDto.dateFin || reservation.dateFin),
        id,
      );

      if (!isAvailable) {
        throw new ConflictException('La chambre n\'est pas disponible pour ces dates');
      }

      // Libérer l'ancienne chambre
      await this.chambresService.update(reservation.chambreId, {
        statut: 'disponible',
      });

      // Occuper la nouvelle chambre
      await this.chambresService.update(updateReservationDto.chambreId, {
        statut: 'occupee',
      });
    }

    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);

    // Libérer la chambre
    await this.chambresService.update(reservation.chambreId, {
      statut: 'disponible',
    });

    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }
  }

  async checkDisponibilite(
    chambreId: number,
    dateDebut: Date,
    dateFin: Date,
    excludeReservationId?: number,
  ): Promise<boolean> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.chambreId = :chambreId', { chambreId })
      .andWhere('reservation.statut IN (:...statuts)', {
        statuts: ['confirmee', 'en_cours'],
      })
      .andWhere(
        '(reservation.dateDebut < :dateFin AND reservation.dateFin > :dateDebut)',
        { dateDebut, dateFin },
      );

    if (excludeReservationId) {
      query.andWhere('reservation.id != :excludeReservationId', {
        excludeReservationId,
      });
    }

    const conflictingReservations = await query.getCount();
    return conflictingReservations === 0;
  }

  async getReservationsParChambre(
    chambreId: number,
    dateDebut?: string,
    dateFin?: string,
  ): Promise<Reservation[]> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.client', 'client')
      .where('reservation.chambreId = :chambreId', { chambreId });

    if (dateDebut && dateFin) {
      query.andWhere(
        'reservation.dateDebut >= :dateDebut AND reservation.dateFin <= :dateFin',
        { dateDebut, dateFin },
      );
    }

    query.orderBy('reservation.dateDebut', 'ASC');

    return await query.getMany();
  }

  async getReservationsParClient(clientId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { clientId },
      relations: ['chambre', 'paiements'],
      order: { dateCreation: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const total = await this.reservationRepository.count();
    const confirmees = await this.reservationRepository.count({
      where: { statut: 'confirmee' },
    });
    const enCours = await this.reservationRepository.count({
      where: { statut: 'en_cours' },
    });
    const terminees = await this.reservationRepository.count({
      where: { statut: 'terminee' },
    });
    const annulees = await this.reservationRepository.count({
      where: { statut: 'annulee' },
    });

    // Revenus du mois en cours
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const revenusMois = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.prixTotal)', 'total')
      .where('reservation.dateCreation BETWEEN :start AND :end', {
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      })
      .andWhere('reservation.statut != :statut', { statut: 'annulee' })
      .getRawOne();

    return {
      total,
      confirmees,
      enCours,
      terminees,
      annulees,
      revenusMois: revenusMois.total || 0,
    };
  }

  async getCheckInsToday(): Promise<Reservation[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.reservationRepository.find({
      where: {
        dateDebut: Between(today, tomorrow),
        statut: 'confirmee',
      },
      relations: ['client', 'chambre'],
    });
  }

  async getCheckOutsToday(): Promise<Reservation[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.reservationRepository.find({
      where: {
        dateFin: Between(today, tomorrow),
        statut: 'en_cours',
      },
      relations: ['client', 'chambre'],
    });
  }
}