import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import EditReservationForm from '../../components/EditReservationForm/EditReservationForm';
import ReservationDetailsModal from '../../components/ReservationDetailsModal/ReservationDetailsModal';
import { reservationsAPI, chambresAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import { exportReservationsCSV } from '../../utils/exportCSV';
import type { Reservation } from '../../types';
import { sendConfirmationEmail } from '../../services/emailService';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'nouvelles' | 'toutes'>('toutes');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [statutFilter, activeTab]);

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

  const handleConfirm = async (reservation: Reservation) => {
  if (window.confirm('Confirmer cette réservation ?')) {
    try {
      // 1. Mettre à jour le statut
      await reservationsAPI.update(reservation.id, { statut: 'confirmee' });
      
      // 2. Mettre à jour la chambre
      await chambresAPI.update(reservation.chambre.id, { statut: 'occupee' });
      
      // 3. Envoyer l'email de confirmation
      const emailSent = await sendConfirmationEmail({
        client_name: `${reservation.client.prenom} ${reservation.client.nom}`,
        client_email: reservation.client.email,
        chambre_numero: reservation.chambre.numero,
        chambre_type: reservation.chambre.type,
        date_debut: reservation.dateDebut,
        date_fin: reservation.dateFin,
        nombre_adultes: reservation.nombreAdultes,
        prix_total: reservation.prixTotal,
      });
      
      if (emailSent) {
        alert('✅ Réservation confirmée ! Email envoyé au client.');
      } else {
        alert('⚠️ Réservation confirmée, mais l\'email n\'a pas pu être envoyé.');
      }
      
      // 4. Rafraîchir la liste
      fetchReservations();
    } catch (error) {
      console.error('Erreur confirmation:', error);
      alert('❌ Erreur lors de la confirmation');
    }
  }
};

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
          // Annuler la réservation
          await reservationsAPI.update(id, { statut: 'annulee' });
          // Libérer la chambre
          await chambresAPI.update(reservation.chambre.id, { statut: 'disponible' });
        }
        fetchReservations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de l\'annulation de la réservation');
      }
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
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

  // Filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    // Filtre par onglet
    if (activeTab === 'nouvelles') {
      if (reservation.statut !== 'en_attente') return false;
      // Optionnel: ajouter filtre source='site_web' si vous avez ce champ
    }

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      const clientName = `${reservation.client.prenom} ${reservation.client.nom}`.toLowerCase();
      const chambreNum = reservation.chambre.numero.toLowerCase();
      
      if (!clientName.includes(searchLower) && !chambreNum.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const nouvellesReservations = reservations.filter(r => r.statut === 'en_attente').length;

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
      <EditReservationForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setSelectedReservation(null);
        }}
        onSuccess={fetchReservations}
        reservation={selectedReservation}
      />

      <ReservationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />

      <Header
        title="Gestion des Réservations"
        subtitle={`${reservations.length} réservations au total`}
        actions={
          <>
            <Button variant="outline" onClick={() => exportReservationsCSV(reservations)}>
              📥 Exporter CSV
            </Button>
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

      {/* Onglets */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'nouvelles' ? 'active' : ''}`}
          onClick={() => setActiveTab('nouvelles')}
        >
          🆕 Nouvelles Réservations
          {nouvellesReservations > 0 && (
            <span className="badge">{nouvellesReservations}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'toutes' ? 'active' : ''}`}
          onClick={() => setActiveTab('toutes')}
        >
          📋 Toutes les Réservations
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom de client ou numéro de chambre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Filtrer par statut:</label>
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente"> En Attente</option>
            <option value="confirmee"> Confirmée</option>
            <option value="en_cours"> En Cours</option>
            <option value="terminee"> Terminée</option>
            <option value="annulee"> Annulée</option>
          </select>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="reservations-grid">
        {filteredReservations.map((reservation, index) => {
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
                    <div className="detail-value price">{formatCurrency(reservation.prixTotal)}</div>
                  </div>
                </div>
              </div>

              {reservation.demandesSpeciales && (
                <div className="special-requests">
                  <strong>Demandes spéciales:</strong> {reservation.demandesSpeciales}
                </div>
              )}

              <div className="reservation-actions">
                {activeTab === 'nouvelles' && (
                  <button 
                    className="btn-icon btn-confirm" 
                    title="Confirmer"
                    onClick={() => handleConfirm(reservation)}
                  >
                     ✅
                  </button>
                )}
                <button 
                  className="btn-icon" 
                  title="Voir détails"
                  onClick={() => handleViewDetails(reservation)}
                >
                  👁
                </button>
                <button 
                  className="btn-icon" 
                  title="Modifier"
                  onClick={() => handleEdit(reservation)}
                >
                  ✎
                </button>
                <button 
                  className="btn-icon btn-icon-danger" 
                  title="Annuler"
                  onClick={() => handleDelete(reservation.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReservations.length === 0 && (
        <div className="no-results">
          <p>Aucune réservation trouvée.</p>
        </div>
      )}
    </div>
  );
};

export default Reservations;