import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import { reservationsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import type { Chambre, Reservation } from '../../types';
import './ChambreDetailsModal.css';

interface ChambreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chambre: Chambre | null;
}

const ChambreDetailsModal = ({ isOpen, onClose, chambre }: ChambreDetailsModalProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chambre && isOpen) {
      fetchReservations();
    }
  }, [chambre, isOpen]);

  const fetchReservations = async () => {
    if (!chambre) return;
    
    try {
      setLoading(true);
      const data = await reservationsAPI.getByChambre(chambre.id);
      setReservations(data);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!chambre) return null;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      standard: 'Standard',
      double: 'Double',
      deluxe: 'Suite Deluxe',
      suite: 'Suite',
      suite_presidentielle: 'Suite Présidentielle',
    };
    return labels[type] || type;
  };

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      occupee: 'Occupée',
      maintenance: 'Maintenance',
    };
    return labels[statut] || statut;
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      disponible: 'var(--success)',
      occupee: 'var(--danger)',
      maintenance: 'var(--warning)',
    };
    return colors[statut] || 'var(--text)';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Chambre ${chambre.numero}`} size="large">
      <div className="chambre-details-modal">
        {/* Image de la chambre */}
        {chambre.imageUrl ? (
          <div className="chambre-image-large">
            <img 
                src={chambre.imageUrl}
              alt={`Chambre ${chambre.numero}`}
            />
          </div>
        ) : (
          <div className="chambre-image-placeholder-large">
            <div className="placeholder-icon-large">🏨</div>
            <p>Aucune photo disponible</p>
          </div>
        )}

        {/* Informations principales */}
        <div className="chambre-header-info">
          <div className="chambre-title-section">
            <h2 className="chambre-title-detail">{getTypeLabel(chambre.type)}</h2>
            <span 
              className="statut-badge-large"
              style={{ background: getStatutColor(chambre.statut) }}
            >
              {getStatutLabel(chambre.statut)}
            </span>
          </div>
          <div className="chambre-prix-large">{formatCurrency(chambre.prix)}/nuit</div>
        </div>

        {/* Caractéristiques */}
        <div className="details-section">
          <h3 className="section-title">📋 Caractéristiques</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">👤</div>
              <div>
                <div className="info-label">Capacité</div>
                <div className="info-value">{chambre.capacite} personnes</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📐</div>
              <div>
                <div className="info-label">Superficie</div>
                <div className="info-value">{chambre.superficie} m²</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🏢</div>
              <div>
                <div className="info-label">Étage</div>
                <div className="info-value">{chambre.etage}ème</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {chambre.description && (
          <div className="details-section">
            <h3 className="section-title">📝 Description</h3>
            <p className="chambre-description-detail">{chambre.description}</p>
          </div>
        )}

        {/* Équipements */}
        {chambre.equipements && chambre.equipements.length > 0 && (
          <div className="details-section">
            <h3 className="section-title">✨ Équipements</h3>
            <div className="equipements-grid">
              {chambre.equipements.map((equipement, index) => (
                <div key={index} className="equipement-item">
                  ✓ {equipement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique des réservations */}
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
                      <strong>{reservation.client.prenom} {reservation.client.nom}</strong>
                    </div>
                    <span className={`status-badge-small status-${reservation.statut}`}>
                      {reservation.statut}
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reservations">
              <p>Aucune réservation pour cette chambre.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChambreDetailsModal;