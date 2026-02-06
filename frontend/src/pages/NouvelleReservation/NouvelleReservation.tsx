import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { reservationsAPI, clientsAPI, chambresAPI } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import type { Client, Chambre } from '../../types';
import './NouvelleReservation.css';

const NouvelleReservation = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [chambresDisponibles, setChambresDisponibles] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    heureArrivee: '14:00',
    heureDepart: '11:00',
    nombreAdultes: 2,
    nombreEnfants: 0,
    clientId: 0,
    chambreId: 0,
    demandesSpeciales: '',
  });

  useEffect(() => {
    fetchClientsEtChambres();
  }, []);

  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      checkDisponibilite();
    }
  }, [formData.dateDebut, formData.dateFin]);

  const fetchClientsEtChambres = async () => {
    try {
      const [clientsData, chambresData] = await Promise.all([
        clientsAPI.getAll({ limit: 100 }),
        chambresAPI.getAll(),
      ]);
      setClients(clientsData.data);
      setChambres(chambresData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const checkDisponibilite = async () => {
    try {
      const disponibles = await chambresAPI.getDisponibles(
        formData.dateDebut,
        formData.dateFin
      );
      setChambresDisponibles(disponibles);
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
    }
  };

  const calculateTotal = () => {
    if (!formData.chambreId || !formData.dateDebut || !formData.dateFin) return 0;
    
    const chambre = chambres.find((c) => c.id === Number(formData.chambreId));
    if (!chambre) return 0;

    const start = new Date(formData.dateDebut);
    const end = new Date(formData.dateFin);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return chambre.prix * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const total = calculateTotal();
      await reservationsAPI.create({
        ...formData,
        clientId: Number(formData.clientId),
        chambreId: Number(formData.chambreId),
        prixTotal: total,
      });
      navigate('/reservations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['nombreAdultes', 'nombreEnfants', 'clientId', 'chambreId'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const total = calculateTotal();
  const selectedChambre = chambres.find((c) => c.id === Number(formData.chambreId));

  return (
    <div className="nouvelle-reservation-page">
      <Header
        title="Nouvelle Réservation"
        subtitle="Créer une nouvelle réservation"
      />

      <div className="reservation-form-layout">
        <div className="form-main">
          <form onSubmit={handleSubmit} className="reservation-form">
            {error && <div className="error-message">{error}</div>}

            {/* Section Client */}
            <div className="form-section">
              <h3 className="section-title">👤 Informations du Client</h3>
              <div className="form-group">
                <label className="form-label">
                  Client <span className="required">*</span>
                </label>
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="0">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.prenom} {client.nom} ({client.email})
                    </option>
                  ))}
                </select>
                <p className="form-hint">
                  Pas de client ? <a href="/clients">Créer un nouveau client</a>
                </p>
              </div>
            </div>

            {/* Section Dates */}
            <div className="form-section">
              <h3 className="section-title">📅 Dates du Séjour</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Date d'arrivée <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Heure d'arrivée
                  </label>
                  <input
                    type="time"
                    name="heureArrivee"
                    value={formData.heureArrivee}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date de départ <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Heure de départ
                  </label>
                  <input
                    type="time"
                    name="heureDepart"
                    value={formData.heureDepart}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section Personnes */}
            <div className="form-section">
              <h3 className="section-title">👥 Nombre de Personnes</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Nombre d'adultes <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="nombreAdultes"
                    value={formData.nombreAdultes}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre d'enfants</label>
                  <input
                    type="number"
                    name="nombreEnfants"
                    value={formData.nombreEnfants}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section Chambre */}
            <div className="form-section">
              <h3 className="section-title">🏨 Sélection de la Chambre</h3>
              {formData.dateDebut && formData.dateFin ? (
                <>
                  <p className="availability-info">
                    {chambresDisponibles.length} chambre(s) disponible(s) pour ces dates
                  </p>
                  <div className="chambres-grid-small">
                    {chambresDisponibles.map((chambre) => (
                      <div
                        key={chambre.id}
                        className={`chambre-option ${
                          Number(formData.chambreId) === chambre.id ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, chambreId: chambre.id }))
                        }
                      >
                        <div className="chambre-option-header">
                          <strong>Chambre {chambre.numero}</strong>
                          <span className="chambre-prix">{formatCurrency(chambre.prix)}/nuit</span>
                        </div>
                        <div className="chambre-option-details">
                          {chambre.type} • {chambre.capacite} pers. • {chambre.superficie}m²
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="form-hint">
                  Sélectionnez d'abord les dates pour voir les chambres disponibles
                </p>
              )}
            </div>

            {/* Section Demandes */}
            <div className="form-section">
              <h3 className="section-title">📝 Demandes Spéciales</h3>
              <div className="form-group">
                <textarea
                  name="demandesSpeciales"
                  value={formData.demandesSpeciales}
                  onChange={handleChange}
                  placeholder="Lit bébé, vue sur mer, étage élevé, etc."
                  rows={4}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/reservations')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" variant="accent" disabled={loading || !formData.chambreId}>
                {loading ? 'Création...' : 'Créer la Réservation'}
              </Button>
            </div>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">📋 Récapitulatif</h3>

            {formData.clientId > 0 && (
              <div className="summary-item">
                <span className="summary-label">Client</span>
                <span className="summary-value">
                  {clients.find((c) => c.id === Number(formData.clientId))?.prenom}{' '}
                  {clients.find((c) => c.id === Number(formData.clientId))?.nom}
                </span>
              </div>
            )}

            {selectedChambre && (
              <div className="summary-item">
                <span className="summary-label">Chambre</span>
                <span className="summary-value">
                  {selectedChambre.numero} - {selectedChambre.type}
                </span>
              </div>
            )}

            {formData.dateDebut && (
              <div className="summary-item">
                <span className="summary-label">Arrivée</span>
                <span className="summary-value">
                  {new Date(formData.dateDebut).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}

            {formData.dateFin && (
              <div className="summary-item">
                <span className="summary-label">Départ</span>
                <span className="summary-value">
                  {new Date(formData.dateFin).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}

            {formData.dateDebut && formData.dateFin && (
              <div className="summary-item">
                <span className="summary-label">Durée</span>
                <span className="summary-value">
                  {Math.ceil(
                    (new Date(formData.dateFin).getTime() -
                      new Date(formData.dateDebut).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  nuit(s)
                </span>
              </div>
            )}

            <div className="summary-item">
              <span className="summary-label">Personnes</span>
              <span className="summary-value">
                {formData.nombreAdultes} adulte(s)
                {formData.nombreEnfants > 0 && `, ${formData.nombreEnfants} enfant(s)`}
              </span>
            </div>

            <div className="summary-total">
              <div className="total-label">Total</div>
              <div className="total-amount">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NouvelleReservation;