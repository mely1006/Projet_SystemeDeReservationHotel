import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { reservationsAPI, chambresAPI } from '../../services/api';
import type { Reservation, Chambre } from '../../types';
import '../ChambreForm/ChambreForm.css';

interface EditReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation: Reservation | null;
}

const EditReservationForm = ({ isOpen, onClose, onSuccess, reservation }: EditReservationFormProps) => {
  const [chambresDisponibles, setChambresDisponibles] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<{
    dateDebut: string;
    dateFin: string;
    heureArrivee: string;
    heureDepart: string;
    nombreAdultes: number;
    nombreEnfants: number;
    chambreId: number;
    statut: 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
    demandesSpeciales: string;
  }>({
    dateDebut: '',
    dateFin: '',
    heureArrivee: '14:00',
    heureDepart: '11:00',
    nombreAdultes: 2,
    nombreEnfants: 0,
    chambreId: 0,
    statut: 'en_attente',
    demandesSpeciales: '',
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        dateDebut: reservation.dateDebut.split('T')[0],
        dateFin: reservation.dateFin.split('T')[0],
        heureArrivee: reservation.heureArrivee || '14:00',
        heureDepart: reservation.heureDepart || '11:00',
        nombreAdultes: reservation.nombreAdultes,
        nombreEnfants: reservation.nombreEnfants,
        chambreId: reservation.chambre.id,
        statut: reservation.statut,
        demandesSpeciales: reservation.demandesSpeciales || '',
      });
      checkDisponibilite(
        reservation.dateDebut.split('T')[0],
        reservation.dateFin.split('T')[0],
        reservation.chambre.id
      );
    }
  }, [reservation]);

  const checkDisponibilite = async (dateDebut: string, dateFin: string, currentChambreId?: number) => {
    try {
      const disponibles = await chambresAPI.getDisponibles(dateDebut, dateFin);
      // Ajouter la chambre actuelle même si occupée
      if (currentChambreId && reservation) {
        const currentChambre = reservation.chambre;
        if (!disponibles.find(c => c.id === currentChambreId)) {
          disponibles.unshift(currentChambre);
        }
      }
      setChambresDisponibles(disponibles);
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
    }
  };

  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      checkDisponibilite(formData.dateDebut, formData.dateFin, formData.chambreId);
    }
  }, [formData.dateDebut, formData.dateFin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    setError('');
    setLoading(true);

    try {
      const oldStatut = reservation.statut;
      const newStatut = formData.statut;
      const oldChambreId = reservation.chambre.id;
      const newChambreId = formData.chambreId;

      // Mettre à jour la réservation
      await reservationsAPI.update(reservation.id, formData);

      // Gérer les changements de statut et de chambre
      if (oldStatut !== newStatut || oldChambreId !== newChambreId) {
        // Si changement de chambre, libérer l'ancienne
        if (oldChambreId !== newChambreId) {
          await chambresAPI.update(oldChambreId, { statut: 'disponible' });
        }

        // Mettre à jour le statut de la nouvelle/même chambre selon le statut
        if (newStatut === 'en_cours') {
          await chambresAPI.update(newChambreId, { statut: 'occupee' });
        } else if (newStatut === 'terminee' || newStatut === 'annulee') {
          await chambresAPI.update(newChambreId, { statut: 'disponible' });
        } else if (newStatut === 'confirmee' && oldChambreId === newChambreId) {
          // Si confirmation sans changement de chambre, garder le statut actuel
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
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
      [name]: ['nombreAdultes', 'nombreEnfants', 'chambreId'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  if (!reservation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la Réservation" size="large">
      <form onSubmit={handleSubmit} className="chambre-form">
        {error && <div className="error-message">{error}</div>}

        {/* Section Statut */}
        <div className="form-section">
          <h3 className="section-title">📊 Statut de la Réservation</h3>
          <div className="form-group">
            <label className="form-label">
              Statut <span className="required">*</span>
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="en_attente"> En Attente</option>
              <option value="confirmee"> Confirmée</option>
              <option value="en_cours"> En Cours</option>
              <option value="terminee"> Terminée</option>
              <option value="annulee"> Annulée</option>
            </select>
            <p className="form-hint">
              {formData.statut === 'en_cours' && '🔵 En changeant en "En Cours", la chambre sera marquée comme occupée'}
              {formData.statut === 'terminee' && '✔️ En changeant en "Terminée", la chambre sera libérée'}
              {formData.statut === 'annulee' && '❌ En annulant, la chambre sera libérée'}
            </p>
          </div>
        </div>

        {/* Section Dates */}
        <div className="form-section">
          <h3 className="section-title">📅 Dates du Séjour</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Date d'arrivée <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
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
                min={formData.dateDebut}
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
          <div className="form-grid">
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
          <h3 className="section-title">🏨 Chambre</h3>
          {chambresDisponibles.length > 0 ? (
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
                      <span className="chambre-prix">{chambre.prix} FCFA/nuit</span>
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
              Sélectionnez les dates pour voir les chambres disponibles
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
              rows={3}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Modification...' : 'Modifier la Réservation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditReservationForm;