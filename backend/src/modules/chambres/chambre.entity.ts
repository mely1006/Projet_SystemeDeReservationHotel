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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix: number;

  @Column({ type: 'int' })
  capacite: number;

  @Column({ type: 'int' })
  etage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
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

/*  @Column({ nullable: true })
  imageUrl: string;*/

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.chambre)
  reservations: Reservation[];
}