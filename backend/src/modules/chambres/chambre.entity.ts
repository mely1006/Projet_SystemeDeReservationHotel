// backend/src/modules/chambres/entities/chambre.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

@Entity('chambres')
export class Chambre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: ['standard', 'double', 'deluxe', 'suite', 'suite_presidentielle'],
  })
  type: string;

  // ✅ Prix : entre 5 000 et 2 000 000 FCFA
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prix: number;

  // ✅ Capacité : entre 1 et 20 personnes
  @Column({ type: 'int' })
  capacite: number;

  // ✅ Étage : entre 0 et 100 (ILLIMITÉ selon besoin)
  @Column({ type: 'int' })
  etage: number;

  // ✅ Superficie : entre 10 et 500 m²
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  superficie: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['disponible', 'occupee', 'maintenance'],
    default: 'disponible',
  })
  statut: string;

  @Column({ type: 'json', nullable: true })
  equipements: string[];

  // ✅ CORRECTION : imageUrl est une string (une seule image)
  // Décommenté et corrigé
  @Column({ nullable: true, type: 'varchar', length: 500 })
  imageUrl: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.chambre)
  reservations: Reservation[];
}