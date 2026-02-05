import { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { clientsAPI } from '../../services/api';
import type { CreateClientInput } from '../../types';
import '../ChambreForm/ChambreForm.css';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm = ({ isOpen, onClose, onSuccess }: ClientFormProps) => {
  const [formData, setFormData] = useState<CreateClientInput>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await clientsAPI.create(formData);
      onSuccess();
      onClose();
      // Réinitialiser le formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        pays: 'France',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un Client" size="medium">
      <form onSubmit={handleSubmit} className="chambre-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Prénom <span className="required">*</span>
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Marie"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Nom <span className="required">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Dubois"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="marie.dubois@email.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Téléphone <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="123 Rue de la République"
            className="form-input"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Ville</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Paris"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Code Postal</label>
            <input
              type="text"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              placeholder="75001"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Pays</label>
          <input
            type="text"
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            placeholder="France"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? 'Création...' : 'Créer le Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientForm;