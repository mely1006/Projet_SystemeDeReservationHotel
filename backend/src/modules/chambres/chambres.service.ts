// backend/src/modules/chambres/chambres.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chambre } from './chambre.entity';
import { CreateChambreDto, UpdateChambreDto, CONTRAINTES_CHAMBRE } from './dto/chambre.dto';

@Injectable()
export class ChambresService {
  constructor(
    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,
  ) {}

  async create(createChambreDto: CreateChambreDto): Promise<Chambre> {
    // ✅ Validation du prix selon le type
    this.validateContraintesType(
      createChambreDto.type,
      createChambreDto.prix,
      createChambreDto.superficie,
      createChambreDto.capacite,
    );

    // ✅ Validation hiérarchique des prix
    await this.validatePrixParType(createChambreDto.type, createChambreDto.prix);

    const chambre = this.chambreRepository.create(createChambreDto);
    return await this.chambreRepository.save(chambre);
  }

  async findAll(statut?: string, type?: string, etage?: number): Promise<Chambre[]> {
    const query = this.chambreRepository.createQueryBuilder('chambre');

    if (statut) {
      query.andWhere('chambre.statut = :statut', { statut });
    }
    if (type) {
      query.andWhere('chambre.type = :type', { type });
    }
    if (etage !== undefined) {
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

    // Valider les contraintes si le type, prix ou superficie changent
    if (updateChambreDto.type || updateChambreDto.prix || updateChambreDto.superficie) {
      const typeToCheck = updateChambreDto.type || chambre.type;
      const prixToCheck = updateChambreDto.prix ?? chambre.prix;
      const superficieToCheck = updateChambreDto.superficie ?? chambre.superficie;
      const capaciteToCheck = updateChambreDto.capacite ?? chambre.capacite;

      this.validateContraintesType(typeToCheck, prixToCheck, superficieToCheck, capaciteToCheck);
      await this.validatePrixParType(typeToCheck, prixToCheck, id);
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
    return this.chambreRepository
      .createQueryBuilder('chambre')
      .leftJoinAndSelect('chambre.reservations', 'reservation')
      .where('chambre.statut = :statut', { statut: 'disponible' })
      .andWhere(
        `(reservation.id IS NULL OR 
         NOT (reservation.dateDebut < :dateFin AND reservation.dateFin > :dateDebut 
         AND reservation.statut IN ('confirmee', 'en_cours')))`,
        { dateDebut, dateFin },
      )
      .getMany();
  }

  async getStats(): Promise<any> {
    const total = await this.chambreRepository.count();
    const disponibles = await this.chambreRepository.count({ where: { statut: 'disponible' } });
    const occupees = await this.chambreRepository.count({ where: { statut: 'occupee' } });
    const maintenance = await this.chambreRepository.count({ where: { statut: 'maintenance' } });
    const tauxOccupation = total > 0 ? ((occupees / total) * 100).toFixed(2) : 0;

    // ✅ Récupérer les étages uniques (dynamique, sans limite)
    const etagesResult = await this.chambreRepository
      .createQueryBuilder('chambre')
      .select('DISTINCT chambre.etage', 'etage')
      .orderBy('chambre.etage', 'ASC')
      .getRawMany();

    const etagesUniques = etagesResult.map(r => r.etage);

    return { total, disponibles, occupees, maintenance, tauxOccupation, etagesUniques };
  }

  // ============================================================
  // ✅ VALIDATION DES CONTRAINTES PAR TYPE
  // ============================================================

  private validateContraintesType(
    type: string,
    prix: number,
    superficie: number,
    capacite: number,
  ): void {
    const contraintes = CONTRAINTES_CHAMBRE[type];
    if (!contraintes) {
      throw new BadRequestException(`Type de chambre invalide: ${type}`);
    }

    const typesLabels: Record<string, string> = {
      standard: 'Standard',
      double: 'Double',
      deluxe: 'Deluxe',
      suite: 'Suite',
      suite_presidentielle: 'Suite Présidentielle',
    };
    const typeLabel = typesLabels[type];

    // Validation du prix
    if (prix < contraintes.prix.min || prix > contraintes.prix.max) {
      throw new BadRequestException(
        `Le prix d'une chambre ${typeLabel} doit être entre ${contraintes.prix.min.toLocaleString('fr-FR')} FCFA et ${contraintes.prix.max.toLocaleString('fr-FR')} FCFA`,
      );
    }

    // Validation de la superficie
    if (superficie < contraintes.superficie.min || superficie > contraintes.superficie.max) {
      throw new BadRequestException(
        `La superficie d'une chambre ${typeLabel} doit être entre ${contraintes.superficie.min} m² et ${contraintes.superficie.max} m²`,
      );
    }

    // Validation de la capacité
    if (capacite < contraintes.capacite.min || capacite > contraintes.capacite.max) {
      throw new BadRequestException(
        `La capacité d'une chambre ${typeLabel} doit être entre ${contraintes.capacite.min} et ${contraintes.capacite.max} personne(s)`,
      );
    }
  }

  // ============================================================
  // ✅ VALIDATION HIÉRARCHIQUE DES PRIX
  // ============================================================

  private async validatePrixParType(
    type: string,
    prix: number,
    chambreIdToExclude?: number,
  ): Promise<void> {
    const hierarchie = ['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'];
    const indexType = hierarchie.indexOf(type);

    if (indexType === -1) {
      throw new BadRequestException('Type de chambre invalide');
    }

    const typesLabels: Record<string, string> = {
      standard: 'Standard',
      double: 'Double',
      deluxe: 'Deluxe',
      suite: 'Suite',
      suite_presidentielle: 'Suite Présidentielle',
    };

    // Vérifier les types inférieurs (leur prix max ne doit pas dépasser le prix actuel)
    for (let i = 0; i < indexType; i++) {
      const typeInferieur = hierarchie[i];
      const qb = this.chambreRepository
        .createQueryBuilder('chambre')
        .where('chambre.type = :type', { type: typeInferieur })
        .andWhere('chambre.prix > :prix', { prix });

      if (chambreIdToExclude) {
        qb.andWhere('chambre.id != :id', { id: chambreIdToExclude });
      }

      const chambreInferieurePlusChere = await qb.getOne();
      if (chambreInferieurePlusChere) {
        throw new BadRequestException(
          `Conflit de prix : une chambre ${typesLabels[typeInferieur]} coûte déjà ${Number(chambreInferieurePlusChere.prix).toLocaleString('fr-FR')} FCFA. Une chambre ${typesLabels[type]} ne peut pas coûter moins cher.`,
        );
      }
    }

    // Vérifier les types supérieurs (leur prix min ne doit pas être inférieur au prix actuel)
    for (let i = indexType + 1; i < hierarchie.length; i++) {
      const typeSuperieur = hierarchie[i];
      const qb = this.chambreRepository
        .createQueryBuilder('chambre')
        .where('chambre.type = :type', { type: typeSuperieur })
        .andWhere('chambre.prix < :prix', { prix });

      if (chambreIdToExclude) {
        qb.andWhere('chambre.id != :id', { id: chambreIdToExclude });
      }

      const chambreSuperieureMoinsChere = await qb.getOne();
      if (chambreSuperieureMoinsChere) {
        throw new BadRequestException(
          `Conflit de prix : une chambre ${typesLabels[typeSuperieur]} coûte seulement ${Number(chambreSuperieureMoinsChere.prix).toLocaleString('fr-FR')} FCFA. Une chambre ${typesLabels[type]} ne peut pas coûter plus cher.`,
        );
      }
    }
  }
}