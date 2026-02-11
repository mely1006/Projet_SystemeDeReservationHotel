import Modal from '../Modal/Modal';
import { formatCurrency } from '../../utils/currency';
import type { Reservation } from '../../types';
import './ReservationDetailsModal.css';

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

const ReservationDetailsModal = ({ isOpen, onClose, reservation }: ReservationDetailsModalProps) => {
  if (!reservation) return null;

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

  const calculateNights = () => {
    const start = new Date(reservation.dateDebut);
    const end = new Date(reservation.dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de la Réservation" size="large">
      <div className="reservation-details-modal">
        {/* En-tête avec statut */}
        <div className="reservation-header-detail">
          <div className="reservation-id">
            <span className="detail-label">Réservation #</span>
            <span className="detail-value-large">{reservation.id}</span>
          </div>
          <span className={`status-badge-detail status-${reservation.statut}`}>
            {getStatutLabel(reservation.statut)}
          </span>
        </div>

        {/* Informations Client */}
        <div className="details-section">
          <h3 className="section-title">👤 Informations du Client</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Nom complet</div>
              <div className="info-value">
                {reservation.client.prenom} {reservation.client.nom}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{reservation.client.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Téléphone</div>
              <div className="info-value">{reservation.client.telephone}</div>
            </div>
            {reservation.client.adresse && (
              <div className="info-item">
                <div className="info-label">Adresse</div>
                <div className="info-value">{reservation.client.adresse}</div>
              </div>
            )}
          </div>
        </div>

        {/* Informations Chambre */}
        <div className="details-section">
          <h3 className="section-title">🏨 Informations de la Chambre</h3>
          <div className="chambre-detail-box">
            <div className="chambre-detail-header">
              <h4>Chambre {reservation.chambre.numero}</h4>
              <span className="chambre-type-badge">{reservation.chambre.type}</span>
            </div>
            <div className="chambre-detail-grid">
              <div className="chambre-detail-item">
                <span className="icon">👥</span>
                <span>Capacité : {reservation.chambre.capacite} personnes</span>
              </div>
              <div className="chambre-detail-item">
                <span className="icon">📐</span>
                <span>Superficie : {reservation.chambre.superficie} m²</span>
              </div>
              <div className="chambre-detail-item">
                <span className="icon">🏢</span>
                <span>Étage : {reservation.chambre.etage}</span>
              </div>
              <div className="chambre-detail-item">
                <span className="icon">💰</span>
                <span>Prix/nuit : {formatCurrency(reservation.chambre.prix)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails du Séjour */}
        <div className="details-section">
          <h3 className="section-title">📅 Détails du Séjour</h3>
          <div className="sejour-grid">
            <div className="sejour-box">
              <div className="sejour-icon">📥</div>
              <div className="sejour-info">
                <div className="sejour-label">Arrivée</div>
                <div className="sejour-date">
                  {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {reservation.heureArrivee && (
                  <div className="sejour-time">à {reservation.heureArrivee}</div>
                )}
              </div>
            </div>

            <div className="sejour-box">
              <div className="sejour-icon">📤</div>
              <div className="sejour-info">
                <div className="sejour-label">Départ</div>
                <div className="sejour-date">
                  {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {reservation.heureDepart && (
                  <div className="sejour-time">à {reservation.heureDepart}</div>
                )}
              </div>
            </div>

            <div className="sejour-box highlight">
              <div className="sejour-icon">🌙</div>
              <div className="sejour-info">
                <div className="sejour-label">Durée</div>
                <div className="sejour-duration">
                  {nights} nuit{nights > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personnes */}
        <div className="details-section">
          <h3 className="section-title">👥 Voyageurs</h3>
          <div className="voyageurs-info">
            <div className="voyageur-item">
              <span className="voyageur-icon">👨</span>
              <span className="voyageur-text">
                {reservation.nombreAdultes} adulte{reservation.nombreAdultes > 1 ? 's' : ''}
              </span>
            </div>
            {reservation.nombreEnfants > 0 && (
              <div className="voyageur-item">
                <span className="voyageur-icon">👶</span>
                <span className="voyageur-text">
                  {reservation.nombreEnfants} enfant{reservation.nombreEnfants > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Prix Total */}
        <div className="details-section">
          <h3 className="section-title">💰 Tarification</h3>
          <div className="pricing-detail">
            <div className="pricing-row">
              <span>Prix par nuit</span>
              <span>{formatCurrency(reservation.chambre.prix)}</span>
            </div>
            <div className="pricing-row">
              <span>{nights} nuit{nights > 1 ? 's' : ''}</span>
              <span>{formatCurrency(reservation.chambre.prix * nights)}</span>
            </div>
            <div className="pricing-row total">
              <span>Total</span>
              <span className="total-amount">{formatCurrency(reservation.prixTotal)}</span>
            </div>
          </div>
        </div>

        {/* Demandes Spéciales */}
        {reservation.demandesSpeciales && (
          <div className="details-section">
            <h3 className="section-title">📝 Demandes Spéciales</h3>
            <div className="special-requests-detail">
              {reservation.demandesSpeciales}
            </div>
          </div>
        )}

        {/* Date de création */}
        <div className="reservation-footer">
          <small>
            Réservation créée le {new Date(reservation.dateCreation).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </small>
        </div>
      </div>
    </Modal>
  );
};

export default ReservationDetailsModal;