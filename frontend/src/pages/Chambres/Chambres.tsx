import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ChambreForm from '../../components/ChambreForm/ChambreForm';
import { chambresAPI } from '../../services/api';
import type { Chambre } from '../../types';
import './Chambres.css';

const Chambres = () => {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    statut: '',
    type: '',
    etage: '',
  });

  useEffect(() => {
    fetchChambres();
  }, [filters]);

  const fetchChambres = async () => {
    try {
      setLoading(true);
      const data = await chambresAPI.getAll({
        statut: filters.statut || undefined,
        type: filters.type || undefined,
        etage: filters.etage ? parseInt(filters.etage) : undefined,
      });
      setChambres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="chambres-loading">
        <div className="spinner"></div>
        <p>Chargement des chambres...</p>
      </div>
    );
  }

  return (
    <div className="chambres-page">
      <ChambreForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchChambres}
      />
      
      <Header
        title="Gestion des Chambres"
        subtitle={`${chambres.length} chambres au total`}
        actions={
          <>
            <Button variant="outline">📥 Exporter</Button>
            <Button variant="accent" icon="➕" onClick={() => setIsFormOpen(true)}>
              Ajouter une Chambre
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Statut:</label>
          <select
            value={filters.statut}
            onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
          >
            <option value="">Tous</option>
            <option value="disponible">Disponible</option>
            <option value="occupee">Occupée</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Type:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Tous les types</option>
            <option value="standard">Standard</option>
            <option value="double">Double</option>
            <option value="deluxe">Suite Deluxe</option>
            <option value="suite">Suite</option>
            <option value="suite_presidentielle">Suite Présidentielle</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Étage:</label>
          <select
            value={filters.etage}
            onChange={(e) => setFilters({ ...filters, etage: e.target.value })}
          >
            <option value="">Tous</option>
            <option value="1">1er</option>
            <option value="2">2ème</option>
            <option value="3">3ème</option>
            <option value="4">4ème</option>
          </select>
        </div>
      </div>

      {/* Chambres Grid */}
      <div className="chambres-grid">
        {chambres.map((chambre, index) => (
          <div key={chambre.id} className="chambre-card" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className={`chambre-image chambre-image-${(index % 6) + 1}`}>
              <div className="chambre-numero">{chambre.numero}</div>
              <span className={`chambre-statut statut-${chambre.statut}`}>
                {getStatutLabel(chambre.statut)}
              </span>
            </div>

            <div className="chambre-content">
              <h3 className="chambre-type">{getTypeLabel(chambre.type)}</h3>

              <div className="chambre-details">
                <span className="chambre-detail">👤 {chambre.capacite} personnes</span>
                <span className="chambre-detail">📐 {chambre.superficie} m²</span>
                <span className="chambre-detail">🏢 {chambre.etage}ème étage</span>
              </div>

              {chambre.description && (
                <p className="chambre-description">{chambre.description}</p>
              )}

              <div className="chambre-footer">
                <div className="chambre-prix-container">
                  <div className="chambre-prix">€{chambre.prix}</div>
                  <div className="prix-label">par nuit</div>
                </div>

                <div className="chambre-actions">
                  <button className="btn-icon" title="Modifier">
                    ✎
                  </button>
                  <button className="btn-icon" title="Détails">
                    👁
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chambres.length === 0 && (
        <div className="no-results">
          <p>Aucune chambre trouvée avec ces filtres.</p>
        </div>
      )}
    </div>
  );
};

export default Chambres;