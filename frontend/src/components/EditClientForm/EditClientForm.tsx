import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { clientsAPI } from '../../services/api';
import type { Client } from '../../types';
import '../ChambreForm/ChambreForm.css';

interface EditClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client: Client | null;
}

const EditClientForm = ({ isOpen, onClose, onSuccess, client }: EditClientFormProps) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setFormData({
        prenom: client.prenom,
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse || '',
        ville: client.ville || '',
        codePostal: client.codePostal || '',
        pays: client.pays || '',
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    
    setError('');
    setLoading(true);

    try {
      await clientsAPI.update(client.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Erreur lors de la modification';
      setError(Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(', ') 
        : errorMessage);
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

  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le Client" size="medium">
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

export default EditClientForm;