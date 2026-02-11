import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { Chambre } from '../chambres/chambre.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    private readonly emailService: EmailService,
  ) {}

  // Vérifier toutes les heures les réservations en attente depuis 24h
  @Cron(CronExpression.EVERY_HOUR)
  async checkPendingReservations() {
    console.log('🔔 Vérification des réservations en attente...');

    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    try {
      const pendingReservations = await this.reservationRepository.find({
        where: {
          statut: 'en_attente',
          dateCreation: LessThan(yesterday),
        },
        relations: ['client', 'chambre'],
      });

      console.log(`⏰ ${pendingReservations.length} réservation(s) en attente depuis 24h`);

      for (const reservation of pendingReservations) {
        try {
          await this.emailService.sendReminderEmail(
            reservation.client.email,
            `${reservation.client.prenom} ${reservation.client.nom}`,
            reservation,
          );
          console.log(`✅ Rappel envoyé pour réservation #${reservation.id}`);
        } catch (error) {
          console.error(`❌ Erreur envoi rappel réservation #${reservation.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Erreur vérification réservations en attente:', error);
    }
  }

  // Vérifier tous les jours à minuit les no-show
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkNoShowReservations() {
    console.log('🔔 Vérification des no-show...');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    try {
      const noShowReservations = await this.reservationRepository.find({
        where: {
          statut: 'confirmee',
          dateDebut: LessThan(yesterday),
        },
        relations: ['client', 'chambre'],
      });

      console.log(`❌ ${noShowReservations.length} no-show détecté(s)`);

      for (const reservation of noShowReservations) {
        try {
          // 1. Annuler la réservation
          await this.reservationRepository.update(reservation.id, {
            statut: 'annulee',
          });

          // 2. Libérer la chambre
          await this.chambreRepository.update(reservation.chambre.id, {
            statut: 'disponible',
          });

          // 3. Envoyer email d'annulation au client
          await this.emailService.sendCancellationEmail(
            reservation.client.email,
            `${reservation.client.prenom} ${reservation.client.nom}`,
            reservation,
          );

          console.log(`✅ Réservation #${reservation.id} annulée (no-show)`);
          console.log(`✅ Chambre ${reservation.chambre.numero} libérée`);
        } catch (error) {
          console.error(`❌ Erreur traitement no-show réservation #${reservation.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Erreur vérification no-show:', error);
    }
  }

  // Méthode manuelle pour tester
  async testNotifications() {
    console.log('🧪 Test des notifications...');
    await this.checkPendingReservations();
    await this.checkNoShowReservations();
    console.log('✅ Test terminé');
  }
}