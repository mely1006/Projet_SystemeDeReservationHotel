import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({
    type: 'enum',
    enum: ['carte_bancaire', 'especes', 'virement', 'paypal'],
  })
  methode: string;

  @Column({
    type: 'enum',
    enum: ['en_attente', 'valide', 'rembourse', 'echoue'],
    default: 'en_attente',
  })
  statut: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  datePaiement: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.paiements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column()
  reservationId: number;
}