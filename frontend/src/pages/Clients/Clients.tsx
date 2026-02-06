// frontend/src/pages/Clients/Clients.tsx
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ClientForm from '../../components/ClientForm/ClientForm';
import EditClientForm from '../../components/EditClientForm/EditClientForm';
import ClientDetailsModal from '../../components/ClientDetailsModal/ClientDetailsModal.tsx';
import { clientsAPI } from '../../services/api.ts';
import { formatCurrency } from '../../utils/currency';
import type { Client } from '../../types';
import { exportClientsCSV } from '../../utils/exportCSV.ts';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [page, setPage] = useState(1);
  //const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  const limit = 10;

  useEffect(() => {
    fetchClients();
  }, [page, search, statutFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await clientsAPI.getAll({
        page,
        limit,
        search,
        statut: statutFilter,
      });

      // récupération propre des données
      const allClients: Client[] = response.data;

      let filtered = [...allClients];

      // Filtre par recherche
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(client =>
          client.nom.toLowerCase().includes(searchLower) ||
          client.prenom.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.telephone.includes(search)
        );
      }

      // Filtre par statut
      if (statutFilter) {
        filtered = filtered.filter(client => client.statut === statutFilter);
      }

      setClients(filtered);

    } catch (error: any) {
      alert('Erreur lors du chargement des clients. Vérifiez que le backend est démarré sur http://localhost:3000');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientsAPI.delete(id);
        fetchClients();
      } catch (error) {
        alert('Erreur lors de la suppression du client');
      }
    }
  };

   const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Statut', 'Réservations', 'Dépenses Totales'];
    const rows = clients.map(c => [
      c.prenom,
      c.nom,
      c.email,
      c.telephone,
      c.statut || 'nouveau',
      c.nombreReservations || 0,
      c.depensesTotales || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatutBadge = (statut?: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      vip: { label: '⭐ VIP', className: 'statut-vip' },
      regulier: { label: 'Régulier', className: 'statut-regulier' },
      nouveau: { label: 'Nouveau', className: 'statut-nouveau' },
    };
    return badges[statut || 'nouveau'] || { label: 'Nouveau', className: 'statut-nouveau' };
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const total = clients.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedClients = clients.slice((page - 1) * limit, page * limit);

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
      
       <EditClientForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setSelectedClient(null);
        }}
        onSuccess={fetchClients}
        client={selectedClient}
      />

       <ClientDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />


      <Header
        title="Gestion des Clients"
        subtitle={`${total} client${total > 1 ? 's' : ''} au total`}
        actions={
          <>
            <Button variant="outline" onClick={() => exportClientsCSV(clients)}>
                      📥 Exporter CSV
            </Button>
            <Button variant="accent" icon="➕" onClick={() => setIsFormOpen(true)}>
              Nouveau Client
            </Button>
          </>
        }
      />

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

     <div className="clients-grid">
        {clients.map((client, index) => {
          const statut = getStatutBadge(client.statut);
          return (
            <div key={client.id} className="client-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="client-card-header">
                <div
                  className="client-avatar-large"
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
                <div className="client-card-info">
                  <h3 className="client-card-name">
                    {client.prenom} {client.nom}
                  </h3>
                  <p className="client-card-email">{client.email}</p>
                  <span className={`statut-badge-card ${statut.className}`}>
                    {statut.label}
                  </span>
                </div>
              </div>

              <div className="client-card-details">
                <div className="detail-row">
                  <span className="detail-label">📞 Téléphone</span>
                  <span className="detail-value">{client.telephone}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">📋 Réservations</span>
                  <span className="detail-value">{client.nombreReservations}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">💰 Dépenses</span>
                  <span className="detail-value">{formatCurrency(Number(client.depensesTotales))}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">📅 Inscrit le</span>
                  <span className="detail-value">
                    {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="client-card-actions">
                <button 
                  className="btn-action btn-view" 
                  onClick={() => handleViewDetails(client)}
                  title="Voir détails"
                >
                  <span>👁</span> Détails
                </button>
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => handleEdit(client)}
                  title="Modifier"
                >
                  <span>✎</span> Modifier
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={() => handleDelete(client.id)}
                  title="Supprimer"
                >
                  <span>🗑</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {clients.length === 0 && !loading && (
        <div className="no-results">
          <p>Aucun client trouvé.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
