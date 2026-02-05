import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { Chambre } from '../chambres/chambre.entity';
import { Paiement } from '../paiements/paiement.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ type: 'time', nullable: true })
  heureArrivee: string;

  @Column({ type: 'time', nullable: true })
  heureDepart: string;

  @Column({ type: 'int' })
  nombreAdultes: number;

  @Column({ type: 'int', default: 0 })
  nombreEnfants: number;

  @Column({
    type: 'enum',
    enum: ['en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee'],
    default: 'en_attente',
  })
  statut: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prixTotal: number;

  @Column({ type: 'text', nullable: true })
  demandesSpeciales: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  @ManyToOne(() => Client, (client) => client.reservations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: number;

  @ManyToOne(() => Chambre, (chambre) => chambre.reservations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chambreId' })
  chambre: Chambre;

  @Column()
  chambreId: number;

  @OneToMany(() => Paiement, (paiement) => paiement.reservation)
  paiements: Paiement[];
}