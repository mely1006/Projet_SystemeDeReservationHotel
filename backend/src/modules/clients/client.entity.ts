import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  ville: string;

  @Column({ nullable: true })
  codePostal: string;

  @Column({ nullable: true })
  pays: string;

  @Column({
    type: 'enum',
    enum: ['nouveau', 'regulier', 'vip'],
    default: 'nouveau',
  })
  statut: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  depensesTotales: number;

  @Column({ type: 'int', default: 0 })
  nombreReservations: number;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];
}