import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ClientForm from '../../components/ClientForm/ClientForm';
import { clientsAPI } from '../../services/api';
import type { Client } from '../../types';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  const limit = 10;

  useEffect(() => {
    fetchClients();
  }, [page, search, statutFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getAll({
        page,
        limit,
        search: search || undefined,
        statut: statutFilter || undefined,
      });
      setClients(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      vip: { label: '⭐ VIP', className: 'statut-vip' },
      regulier: { label: 'Régulier', className: 'statut-regulier' },
      nouveau: { label: 'Nouveau', className: 'statut-nouveau' },
    };
    return badges[statut] || { label: statut, className: '' };
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && clients.length === 0) {
    return (
      <div className="clients-loading">
        <div className="spinner"></div>
        <p>Chargement des clients...</p>
      </div>
    );
  }

  return (
    <div className="clients-page">
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchClients}
      />
      
      <Header
        title="Gestion des Clients"
        subtitle={`${total} clients au total`}
        actions={
          <>
            <Button variant="outline">📥 Exporter</Button>
            <Button variant="accent" icon="➕" onClick={() => setIsFormOpen(true)}>
              Nouveau Client
            </Button>
          </>
        }
      />

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={statutFilter}
          onChange={(e) => {
            setStatutFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="vip">VIP</option>
          <option value="regulier">Régulier</option>
          <option value="nouveau">Nouveau</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="clients-table-wrapper">
        <div className="table-header">
          <h2 className="table-title">Liste des Clients</h2>
          <span className="results-count">
            Affichage {(page - 1) * limit + 1}-{Math.min(page * limit, total)} sur {total}
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Réservations</th>
                <th>Dépenses Totales</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => {
                const statut = getStatutBadge(client.statut);
                return (
                  <tr key={client.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <td>
                      <div className="client-cell">
                        <div
                          className="client-avatar"
                          style={{
                            background: `linear-gradient(135deg, ${
                              ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#30cfd0'][
                                index % 6
                              ]
                            } 0%, ${
                              ['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fee140', '#330867'][
                                index % 6
                              ]
                            } 100%)`,
                          }}
                        >
                          {getInitials(client.prenom, client.nom)}
                        </div>
                        <div className="client-info">
                          <span className="client-name">
                            {client.prenom} {client.nom}
                          </span>
                          <span className="client-email">{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{client.telephone}</td>
                    <td>
                      <span className={`statut-badge ${statut.className}`}>
                        {statut.label}
                      </span>
                    </td>
                    <td>
                      <div className="stat-cell">
                        <span className="stat-value">{client.nombreReservations}</span>
                        <span className="stat-label">réservations</span>
                      </div>
                    </td>
                    <td>
                      <span className="stat-value">€{Number(client.depensesTotales).toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="stat-cell">
                        <span className="stat-value">
                          {new Date(client.dateCreation).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-icon" title="Voir le profil">
                          👁
                        </button>
                        <button className="btn-icon" title="Modifier">
                          ✎
                        </button>
                        <button className="btn-icon" title="Historique">
                          📋
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Affichage {(page - 1) * limit + 1}-{Math.min(page * limit, total)} sur {total} clients
          </div>
          <div className="pagination-buttons">
            <button
              className="page-btn"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="pagination-dots">...</span>}
            <button
              className="page-btn"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {clients.length === 0 && !loading && (
        <div className="no-results">
          <p>Aucun client trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;