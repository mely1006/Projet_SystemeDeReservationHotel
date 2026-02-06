import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import StatCard from '../../components/StatCard/StatCard';
import Button from '../../components/Button/Button';
import { dashboardAPI, reservationsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import type { DashboardStats, Reservation } from '../../types';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, reservations] = await Promise.all([
          dashboardAPI.getStats(),
          reservationsAPI.getAll(),
        ]);
        setStats(dashboardStats);
        setRecentReservations(reservations.slice(0, 5));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header
        title="Tableau de Bord"
        actions={
          <Button variant="accent" icon="➕" onClick={() => navigate('/reservations/nouvelle')}>
            Nouvelle Réservation
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Réservations Actives"
          value={stats?.reservations.enCours || 0}
          //trend={{ value: '12% ce mois', isPositive: true }}
          icon="📋"
        />
        <StatCard
          label="Taux d'Occupation"
          value={`${stats?.chambres.tauxOccupation || 0}%`}
          //trend={{ value: '5% vs hier', isPositive: true }}
          icon="🏨"
        />
        <StatCard
          label="Revenus du Mois"
          value={formatCurrency(Number(stats?.reservations.revenusMois || 0))}
          //trend={{ value: '18% ce mois', isPositive: true }}
          icon="💰"
        />
        <StatCard
          label="Chambres Disponibles"
          value={stats?.chambres.disponibles || 0}
          //trend={{ value: '8 vs hier', isPositive: false }}
          icon="🔑"
        />
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Reservations */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Réservations Récentes</h2>
            <Button variant="outline" size="small">
              Voir tout
            </Button>
          </div>

          <div className="reservations-list">
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-item">
                <div className="reservation-header">
                  <span className="reservation-client">
                    {reservation.client.prenom} {reservation.client.nom}
                  </span>
                  <span className={`status-badge status-${reservation.statut}`}>
                    {reservation.statut === 'confirmee' && 'Confirmée'}
                    {reservation.statut === 'en_attente' && 'En Attente'}
                    {reservation.statut === 'en_cours' && 'En Cours'}
                    {reservation.statut === 'terminee' && 'Terminée'}
                    {reservation.statut === 'annulee' && 'Annulée'}
                  </span>
                </div>
                <div className="reservation-details">
                  <span className="detail-item">
                    🏨 Chambre {reservation.chambre.numero}
                  </span>
                  <span className="detail-item">
                    📅 {new Date(reservation.dateDebut).toLocaleDateString()} -{' '}
                    {new Date(reservation.dateFin).toLocaleDateString()}
                  </span>
                  <span className="detail-item">💰 {formatCurrency(reservation.prixTotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Statistiques Rapides</h2>
            </div>

            <div className="quick-stats">
              <div className="quick-stat">
                <div className="quick-stat-label">Check-ins Aujourd'hui</div>
                <div className="quick-stat-value">
                  {stats?.checkInsToday.length || 0}
                </div>
              </div>

              <div className="quick-stat">
                <div className="quick-stat-label">Check-outs Aujourd'hui</div>
                <div className="quick-stat-value">
                  {stats?.checkOutsToday.length || 0}
                </div>
              </div>

              <div className="quick-stat">
                <div className="quick-stat-label">Total Clients</div>
                <div className="quick-stat-value">{stats?.clients.total || 0}</div>
              </div>

              <div className="quick-stat">
                <div className="quick-stat-label">Clients VIP</div>
                <div className="quick-stat-value">{stats?.clients.vip || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;