import { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { chambresAPI } from '../../services/api';
import type { CreateChambreInput } from '../../types';
import './ChambreForm.css';

interface ChambreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ChambreForm = ({ isOpen, onClose, onSuccess }: ChambreFormProps) => {
  const [formData, setFormData] = useState<CreateChambreInput>({
    numero: '',
    type: 'standard',
    prix: 0,
    capacite: 2,
    etage: 1,
    superficie: 0,
    description: '',
    equipements: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await chambresAPI.create(formData);
      onSuccess();
      onClose();
      // Réinitialiser le formulaire
      setFormData({
        numero: '',
        type: 'standard',
        prix: 0,
        capacite: 2,
        etage: 1,
        superficie: 0,
        description: '',
        equipements: [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la chambre');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une Chambre" size="medium">
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
              placeholder="101"
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
              Prix par nuit (€) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              placeholder="95"
              min="0"
              step="0.01"
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
              max="20"
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
              placeholder="25"
              min="0"
              step="0.01"
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Chambre spacieuse avec vue sur jardin..."
            rows={3}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Création...' : 'Créer la Chambre'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChambreForm;