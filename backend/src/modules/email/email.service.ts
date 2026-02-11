import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendConfirmationEmail(
    clientEmail: string,
    clientName: string,
    reservation: any,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.HOTEL_NAME || 'HotelPro'}" <${process.env.EMAIL_USER}>`,
        to: clientEmail,
        subject: '✅ Confirmation de votre réservation - HotelPro',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a3a52; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #d4af37; }
              .details h3 { color: #1a3a52; margin-top: 0; }
              .detail-item { padding: 10px 0; border-bottom: 1px solid #eee; }
              .detail-item:last-child { border-bottom: none; }
              .label { font-weight: bold; color: #1a3a52; display: inline-block; width: 150px; }
              .value { color: #333; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { background: #d4af37; color: #1a3a52; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Réservation Confirmée !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Nous avons le plaisir de confirmer votre réservation à <strong>HotelPro</strong>.</p>
                
                <div class="details">
                  <h3>📋 Détails de votre réservation</h3>
                  <div class="detail-item">
                    <span class="label">🏨 Chambre :</span>
                    <span class="value">N° ${reservation.chambre.numero} (${reservation.chambre.type})</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">📅 Arrivée :</span>
                    <span class="value">${new Date(reservation.dateDebut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">📅 Départ :</span>
                    <span class="value">${new Date(reservation.dateFin).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">👥 Personnes :</span>
                    <span class="value">${reservation.nombreAdultes} adulte(s)${reservation.nombreEnfants > 0 ? `, ${reservation.nombreEnfants} enfant(s)` : ''}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">💰 Prix Total :</span>
                    <span class="value"><strong>${reservation.prixTotal.toLocaleString()} FCFA</strong></span>
                  </div>
                </div>

                <p><strong>Informations importantes :</strong></p>
                <ul>
                  <li>⏰ Check-in à partir de 14h00</li>
                  <li>⏰ Check-out avant 11h00</li>
                  <li>🆔 Veuillez vous munir d'une pièce d'identité</li>
                  <li>💳 Le paiement peut être effectué à l'arrivée</li>
                </ul>

                <p>Nous nous réjouissons de vous accueillir !</p>
                <p>Cordialement,<br><strong>L'équipe HotelPro</strong></p>
              </div>
              <div class="footer">
                <p>HotelPro - Votre séjour, notre priorité</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmation envoyé à ${clientEmail}`);
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw error;
    }
  }

  async sendReminderEmail(
    clientEmail: string,
    clientName: string,
    reservation: any,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.HOTEL_NAME || 'HotelPro'}" <${process.env.EMAIL_USER}>`,
        to: clientEmail,
        subject: '⏰ Rappel : Confirmation de réservation en attente',
        html: `
          <h1>⏰ Rappel Important</h1>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Votre réservation (Chambre ${reservation.chambre.numero}) est en attente de confirmation.</p>
          <p>Veuillez contacter notre réception.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`⏰ Email de rappel envoyé à ${clientEmail}`);
    } catch (error) {
      console.error('❌ Erreur envoi rappel:', error);
      throw error;
    }
  }

  async sendCancellationEmail(
    clientEmail: string,
    clientName: string,
    reservation: any,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.HOTEL_NAME || 'HotelPro'}" <${process.env.EMAIL_USER}>`,
        to: clientEmail,
        subject: '❌ Annulation de votre réservation',
        html: `
          <h1>❌ Réservation Annulée</h1>
          <p>Bonjour <strong>${clientName}</strong>,</p>
          <p>Votre réservation (Chambre ${reservation.chambre.numero}) a été annulée.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`❌ Email d'annulation envoyé à ${clientEmail}`);
    } catch (error) {
      console.error('❌ Erreur envoi annulation:', error);
    }
  }
}