import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { chambresAPI } from '../../services/api';
import type { Chambre } from '../../types';
//import './components/ChambreForm/ChambreForm.css';

interface EditChambreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  chambre: Chambre | null;
}

const EditChambreForm = ({ isOpen, onClose, onSuccess, chambre }: EditChambreFormProps) => {
  const [formData, setFormData] = useState({
    numero: '',
    type: 'standard' as 'standard' | 'double' | 'deluxe' | 'suite' | 'suite_presidentielle',
    prix: 0,
    capacite: 2,
    etage: 1,
    superficie: 0,
    description: '',
    statut: 'disponible' as 'disponible' | 'occupee' | 'maintenance',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (chambre) {
      setFormData({
        numero: chambre.numero,
        type: chambre.type,
        prix: chambre.prix,
        capacite: chambre.capacite,
        etage: chambre.etage,
        superficie: chambre.superficie,
        description: chambre.description || '',
        statut: chambre.statut,
      });
    }
  }, [chambre]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chambre) return;
    
    setError('');
    setLoading(true);

    try {
      await chambresAPI.update(chambre.id, formData);
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
      [name]: ['prix', 'capacite', 'etage', 'superficie'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  if (!chambre) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la Chambre" size="medium">
      <form onSubmit={handleSubmit} className="chambre-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Numéro de chambre <span className="required">*</span>
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Type de chambre <span className="required">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="standard">Standard</option>
              <option value="double">Double</option>
              <option value="deluxe">Suite Deluxe</option>
              <option value="suite">Suite</option>
              <option value="suite_presidentielle">Suite Présidentielle</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Prix par nuit (FCFA) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              min="0"
              step="100"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Capacité (personnes) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="capacite"
              value={formData.capacite}
              onChange={handleChange}
              min="1"
              max="10"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Étage <span className="required">*</span>
            </label>
            <input
              type="number"
              name="etage"
              value={formData.etage}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Superficie (m²) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="superficie"
              value={formData.superficie}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="form-input"
            />
          </div>

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
              <option value="disponible">Disponible</option>
              <option value="occupee">Occupée</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Modification...' : 'Modifier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditChambreForm;