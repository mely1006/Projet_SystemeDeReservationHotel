import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import { reservationsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import type { Client, Reservation } from '../../types';
import './ClientDetailsModal.css';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientDetailsModal = ({ isOpen, onClose, client }: ClientDetailsModalProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      fetchReservations();
    }
  }, [client, isOpen]);

  const fetchReservations = async () => {
    if (!client) return;
    
    try {
      setLoading(true);
      const data = await reservationsAPI.getByClient(client.id);
      setReservations(data);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En Attente',
      confirmee: 'Confirmée',
      en_cours: 'En Cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    };
    return labels[statut] || statut;
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      vip: { label: '⭐ VIP', className: 'badge-vip' },
      regulier: { label: 'Régulier', className: 'badge-regulier' },
      nouveau: { label: 'Nouveau', className: 'badge-nouveau' },
    };
    return badges[statut] || { label: statut, className: '' };
  };

  const statut = getStatutBadge(client.statut);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du Client" size="large">
      <div className="client-details-modal">
        {/* En-tête Client */}
        <div className="client-header">
          <div className="client-avatar-detail">
            {client.prenom.charAt(0)}{client.nom.charAt(0)}
          </div>
          <div className="client-header-info">
            <h2 className="client-name-detail">
              {client.prenom} {client.nom}
            </h2>
            <p className="client-email-detail">{client.email}</p>
            <span className={`statut-badge-detail ${statut.className}`}>
              {statut.label}
            </span>
          </div>
        </div>

        {/* Informations de Contact */}
        <div className="details-section">
          <h3 className="section-title">📞 Informations de Contact</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Téléphone</div>
              <div className="info-value">{client.telephone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{client.email}</div>
            </div>
            {client.adresse && (
              <div className="info-item">
                <div className="info-label">Adresse</div>
                <div className="info-value">{client.adresse}</div>
              </div>
            )}
            {client.ville && (
              <div className="info-item">
                <div className="info-label">Ville</div>
                <div className="info-value">
                  {client.ville} {client.codePostal ? `(${client.codePostal})` : ''}
                </div>
              </div>
            )}
            {client.pays && (
              <div className="info-item">
                <div className="info-label">Pays</div>
                <div className="info-value">{client.pays}</div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="details-section">
          <h3 className="section-title">📊 Statistiques</h3>
          <div className="stats-grid">
            <div className="stat-box-detail">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-value">{client.nombreReservations}</div>
                <div className="stat-label">Réservations</div>
              </div>
            </div>
            <div className="stat-box-detail">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">
                  {formatCurrency(Number(client.depensesTotales))}
                </div>
                <div className="stat-label">Dépenses Totales</div>
              </div>
            </div>
            <div className="stat-box-detail">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-value">
                  {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                </div>
                <div className="stat-label">Client depuis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des Réservations */}
        <div className="details-section">
          <h3 className="section-title">🗓️ Historique des Réservations</h3>
          {loading ? (
            <div className="loading-reservations">
              <div className="spinner-small"></div>
              <p>Chargement...</p>
            </div>
          ) : reservations.length > 0 ? (
            <div className="reservations-history">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-history-item">
                  <div className="reservation-history-header">
                    <div>
                      <strong>Chambre {reservation.chambre.numero}</strong>
                      <span className="reservation-type"> ({reservation.chambre.type})</span>
                    </div>
                    <span className={`status-badge-small status-${reservation.statut}`}>
                      {getStatutLabel(reservation.statut)}
                    </span>
                  </div>
                  <div className="reservation-history-details">
                    <div className="history-detail">
                      <span className="detail-icon">📅</span>
                      {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} -{' '}
                      {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="history-detail">
                      <span className="detail-icon">💰</span>
                      {formatCurrency(reservation.prixTotal)}
                    </div>
                    <div className="history-detail">
                      <span className="detail-icon">👥</span>
                      {reservation.nombreAdultes} adulte(s)
                      {reservation.nombreEnfants > 0 && `, ${reservation.nombreEnfants} enfant(s)`}
                    </div>
                  </div>
                  {reservation.demandesSpeciales && (
                    <div className="reservation-notes">
                      <strong>Demandes:</strong> {reservation.demandesSpeciales}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reservations">
              <p>Aucune réservation pour ce client.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClientDetailsModal;