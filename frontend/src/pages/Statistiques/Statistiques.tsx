import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import StatCard from '../../components/StatCard/StatCard';
import { dashboardAPI, reservationsAPI, chambresAPI, clientsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import './Statistiques.css';

const Statistiques = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="statistiques-page">
      <Header title="Statistiques" subtitle="Analyse détaillée de votre hôtel" />

      {/* Statistiques Globales */}
      <div className="stats-section">
        <h2 className="section-title">📊 Vue d'Ensemble</h2>
        <div className="stats-grid-4">
          <StatCard
            label="Réservations Totales"
            value={stats?.reservations.total || 0}
            icon="📋"
          />
          <StatCard
            label="Clients Enregistrés"
            value={stats?.clients.total || 0}
            icon="👥"
          />
          <StatCard
            label="Chambres Disponibles"
            value={stats?.chambres.disponibles || 0}
            icon="🏨"
          />
          <StatCard
            label="Taux d'Occupation"
            value={`${stats?.chambres.tauxOccupation || 0}%`}
            icon="📈"
          />
        </div>
      </div>

      {/* Statistiques Réservations */}
      <div className="stats-section">
        <h2 className="section-title">📅 Réservations</h2>
        <div className="stats-grid-3">
          <div className="stat-box">
            <div className="stat-box-header">
              <h3>Réservations Confirmées</h3>
              <span className="stat-badge success">{stats?.reservations.confirmees || 0}</span>
            </div>
            <div className="stat-box-content">
              <div className="progress-bar">
                <div 
                  className="progress-fill success" 
                  style={{width: `${(stats?.reservations.confirmees / stats?.reservations.total * 100) || 0}%`}}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-header">
              <h3>En Cours</h3>
              <span className="stat-badge primary">{stats?.reservations.enCours || 0}</span>
            </div>
            <div className="stat-box-content">
              <div className="progress-bar">
                <div 
                  className="progress-fill primary" 
                  style={{width: `${(stats?.reservations.enCours / stats?.reservations.total * 100) || 0}%`}}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-header">
              <h3>Annulées</h3>
              <span className="stat-badge danger">{stats?.reservations.annulees || 0}</span>
            </div>
            <div className="stat-box-content">
              <div className="progress-bar">
                <div 
                  className="progress-fill danger" 
                  style={{width: `${(stats?.reservations.annulees / stats?.reservations.total * 100) || 0}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques Financières */}
      <div className="stats-section">
        <h2 className="section-title">💰 Revenus</h2>
        <div className="stats-grid-2">
          <div className="revenue-card">
            <div className="revenue-header">
              <h3>Revenus du Mois</h3>
              <span className="revenue-icon">📊</span>
            </div>
            <div className="revenue-amount">
              {formatCurrency(Number(stats?.reservations.revenusMois || 0))}
            </div>
            <div className="revenue-label">Ce mois-ci</div>
          </div>

          <div className="revenue-card">
            <div className="revenue-header">
              <h3>Revenu Moyen par Réservation</h3>
              <span className="revenue-icon">💵</span>
            </div>
            <div className="revenue-amount">
              {formatCurrency(
                stats?.reservations.total > 0
                  ? Math.round(Number(stats?.reservations.revenusMois) / stats?.reservations.confirmees)
                  : 0
              )}
            </div>
            <div className="revenue-label">Par réservation</div>
          </div>
        </div>
      </div>

      {/* Statistiques Clients */}
      <div className="stats-section">
        <h2 className="section-title">👥 Clients</h2>
        <div className="stats-grid-3">
          <div className="client-stat-box vip">
            <div className="client-stat-icon">⭐</div>
            <div className="client-stat-number">{stats?.clients.vip || 0}</div>
            <div className="client-stat-label">Clients VIP</div>
          </div>

          <div className="client-stat-box regulier">
            <div className="client-stat-icon">👤</div>
            <div className="client-stat-number">{stats?.clients.reguliers || 0}</div>
            <div className="client-stat-label">Clients Réguliers</div>
          </div>

          <div className="client-stat-box nouveau">
            <div className="client-stat-icon">✨</div>
            <div className="client-stat-number">{stats?.clients.nouveaux || 0}</div>
            <div className="client-stat-label">Nouveaux Clients</div>
          </div>
        </div>
      </div>

      {/* Statistiques Chambres */}
      <div className="stats-section">
        <h2 className="section-title">🏨 Chambres</h2>
        <div className="stats-grid-3">
          <div className="chamber-stat disponible">
            <div className="chamber-stat-circle">
              <div className="chamber-stat-value">{stats?.chambres.disponibles || 0}</div>
            </div>
            <div className="chamber-stat-label">Disponibles</div>
          </div>

          <div className="chamber-stat occupee">
            <div className="chamber-stat-circle">
              <div className="chamber-stat-value">{stats?.chambres.occupees || 0}</div>
            </div>
            <div className="chamber-stat-label">Occupées</div>
          </div>

          <div className="chamber-stat maintenance">
            <div className="chamber-stat-circle">
              <div className="chamber-stat-value">{stats?.chambres.maintenance || 0}</div>
            </div>
            <div className="chamber-stat-label">Maintenance</div>
          </div>
        </div>
      </div>

      {/* Check-ins et Check-outs */}
      <div className="stats-section">
        <h2 className="section-title">🔔 Aujourd'hui</h2>
        <div className="stats-grid-2">
          <div className="today-card checkin">
            <h3>Check-ins</h3>
            <div className="today-number">{stats?.checkInsToday.length || 0}</div>
            <p>Arrivées prévues</p>
          </div>

          <div className="today-card checkout">
            <h3>Check-outs</h3>
            <div className="today-number">{stats?.checkOutsToday.length || 0}</div>
            <p>Départs prévus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;