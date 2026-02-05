import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { reservationsAPI } from '../../services/api';
import type { Reservation } from '../../types';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [statutFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationsAPI.getAll({
        statut: statutFilter || undefined,
      });
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const calculateNights = (dateDebut: string, dateFin: string) => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="reservations-loading">
        <div className="spinner"></div>
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <Header
        title="Gestion des Réservations"
        subtitle={`${reservations.length} réservations au total`}
        actions={
          <>
            <Button variant="outline">📥 Exporter</Button>
            <Button 
              variant="accent" 
              icon="➕" 
              onClick={() => navigate('/reservations/nouvelle')}
            >
              Nouvelle Réservation
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Filtrer par statut:</label>
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En Attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_cours">En Cours</option>
            <option value="terminee">Terminée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="reservations-grid">
        {reservations.map((reservation, index) => {
          const nights = calculateNights(reservation.dateDebut, reservation.dateFin);
          
          return (
            <div
              key={reservation.id}
              className="reservation-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="reservation-card-header">
                <div className="reservation-client-info">
                  <div className="client-avatar">
                    {reservation.client.prenom.charAt(0)}{reservation.client.nom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="client-name">
                      {reservation.client.prenom} {reservation.client.nom}
                    </h3>
                    <p className="client-contact">{reservation.client.email}</p>
                  </div>
                </div>
                <span className={`status-badge-large status-${reservation.statut}`}>
                  {getStatutLabel(reservation.statut)}
                </span>
              </div>

              <div className="reservation-details-grid">
                <div className="detail-box">
                  <span className="detail-icon">🏨</span>
                  <div>
                    <div className="detail-label">Chambre</div>
                    <div className="detail-value">{reservation.chambre.numero}</div>
                  </div>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">📅</span>
                  <div>
                    <div className="detail-label">Arrivée</div>
                    <div className="detail-value">
                      {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">📅</span>
                  <div>
                    <div className="detail-label">Départ</div>
                    <div className="detail-value">
                      {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">🌙</span>
                  <div>
                    <div className="detail-label">Durée</div>
                    <div className="detail-value">{nights} nuit{nights > 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">👥</span>
                  <div>
                    <div className="detail-label">Personnes</div>
                    <div className="detail-value">
                      {reservation.nombreAdultes} adulte{reservation.nombreAdultes > 1 ? 's' : ''}
                      {reservation.nombreEnfants > 0 && `, ${reservation.nombreEnfants} enfant${reservation.nombreEnfants > 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>

                <div className="detail-box price-box">
                  <span className="detail-icon">💰</span>
                  <div>
                    <div className="detail-label">Prix Total</div>
                    <div className="detail-value price">€{reservation.prixTotal}</div>
                  </div>
                </div>
              </div>

              {reservation.demandesSpeciales && (
                <div className="special-requests">
                  <strong>Demandes spéciales:</strong> {reservation.demandesSpeciales}
                </div>
              )}

              <div className="reservation-actions">
                <button className="btn-icon" title="Voir détails">👁</button>
                <button className="btn-icon" title="Modifier">✎</button>
                <button className="btn-icon" title="Annuler">🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {reservations.length === 0 && (
        <div className="no-results">
          <p>Aucune réservation trouvée.</p>
        </div>
      )}
    </div>
  );
};

export default Reservations;