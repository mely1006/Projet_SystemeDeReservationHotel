// frontend/src/components/ChambreForm/ChambreForm.tsx
import React, { useState } from 'react';
import './ChambreForm.css';

// URL API avec préfixe /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ChambreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  chambre?: any;
}

// Contraintes par type (côté frontend pour validation immédiate)
const CONTRAINTES = {
  standard:             { prix: { min: 10000, max: 50000 },   superficie: { min: 15, max: 30 },  capacite: { min: 1, max: 2 } },
  double:               { prix: { min: 30000, max: 80000 },   superficie: { min: 20, max: 40 },  capacite: { min: 1, max: 3 } },
  deluxe:               { prix: { min: 50000, max: 150000 },  superficie: { min: 25, max: 55 },  capacite: { min: 1, max: 4 } },
  suite:                { prix: { min: 80000, max: 300000 },  superficie: { min: 35, max: 80 },  capacite: { min: 1, max: 6 } },
  suite_presidentielle: { prix: { min: 150000, max: 1000000 },superficie: { min: 60, max: 200 }, capacite: { min: 1, max: 10 } },
};

const ChambreForm: React.FC<ChambreFormProps> = ({ isOpen, onClose, onSuccess, chambre }) => {
  const [formData, setFormData] = useState({
    numero:      chambre?.numero      || '',
    type:        chambre?.type        || 'standard',
    prix:        chambre?.prix        || '',
    capacite:    chambre?.capacite    || '',
    etage:       chambre?.etage       || '',
    superficie:  chambre?.superficie  || '',
    description: chambre?.description || '',
    statut:      chambre?.statut      || 'disponible',
    equipements: chambre?.equipements || [],
  });

  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(chambre?.imageUrl || '');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  // Contraintes du type sélectionné
  const contraintes = CONTRAINTES[formData.type as keyof typeof CONTRAINTES];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Seules les images (jpeg, png, gif, webp) sont autorisées');
      return;
    }

    // Vérifier la taille (10MB max)
    if (file.size > 10* 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 10MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = chambre?.imageUrl || '';

      // ÉTAPE 1 : Upload de l'image si une nouvelle image est sélectionnée
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);

        const uploadResponse = await fetch(`${API_URL}/api/upload/chambre`, {
          method: 'POST',
          body: formDataImage,
          // NE PAS mettre Content-Type pour multipart/form-data
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.message || 'Erreur lors de l\'upload de l\'image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        console.log('Image uploadée :', imageUrl);
      }

      // Créer ou modifier la chambre
      const chambreData = {
        ...formData,
        prix:       Number(formData.prix),
        capacite:   Number(formData.capacite),
        etage:      Number(formData.etage),
        superficie: Number(formData.superficie),
        imageUrl:   imageUrl || undefined,
      };

      const url    = chambre
        ? `${API_URL}/api/chambres/${chambre.id}`
        : `${API_URL}/api/chambres`;
      const method = chambre ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chambreData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message || 'Erreur lors de l\'enregistrement'
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>◆ {chambre ? 'Modifier la Chambre' : 'Ajouter une Chambre'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="chambre-form">
          <div className="form-grid">

            {/* Numéro */}
            <div className="form-group">
              <label>Numéro de chambre *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                placeholder="Ex: 101, A-205"
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label>Type de chambre *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="standard">Standard</option>
                <option value="double">Double</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="suite_presidentielle">Suite Présidentielle</option>
              </select>
            </div>

            {/* Prix */}
            <div className="form-group">
              <label>
                Prix par nuit (FCFA) *
                <span className="form-hint">
                  {contraintes.prix.min.toLocaleString('fr-FR')} - {contraintes.prix.max.toLocaleString('fr-FR')} FCFA
                </span>
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                required
                min={contraintes.prix.min}
                max={contraintes.prix.max}
                placeholder={`Ex: ${contraintes.prix.min.toLocaleString('fr-FR')}`}
              />
            </div>

            {/* Capacité */}
            <div className="form-group">
              <label>
                Capacité (personnes) *
                <span className="form-hint">
                  Max {contraintes.capacite.max} pour ce type
                </span>
              </label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                required
                min={contraintes.capacite.min}
                max={contraintes.capacite.max}
              />
            </div>

            {/* Étage - ILLIMITÉ */}
            <div className="form-group">
              <label>
                Étage *
                <span className="form-hint">0 = rez-de-chaussée, sans limite</span>
              </label>
              <input
                type="number"
                name="etage"
                value={formData.etage}
                onChange={handleChange}
                required
                min={0}
                max={100}
                placeholder="Ex: 0, 1, 2, 10..."
              />
            </div>

            {/* Superficie */}
            <div className="form-group">
              <label>
                Superficie (m²) *
                <span className="form-hint">
                  {contraintes.superficie.min} - {contraintes.superficie.max} m²
                </span>
              </label>
              <input
                type="number"
                name="superficie"
                value={formData.superficie}
                onChange={handleChange}
                required
                min={contraintes.superficie.min}
                max={contraintes.superficie.max}
                step="0.5"
              />
            </div>

            {/* Statut (seulement en modification) */}
            {chambre && (
              <div className="form-group">
                <label>Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange}>
                  <option value="disponible"> Disponible</option>
                  <option value="occupee"> Occupée</option>
                  <option value="maintenance"> Maintenance</option>
                </select>
              </div>
            )}

            {/* Description */}
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description de la chambre, équipements, vue..."
              />
            </div>

            {/* Upload image */}
            <div className="form-group full-width">
              <label>📷 Photo de la chambre</label>
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => { setImageFile(null); setImagePreview(''); }}
                    >
                      ✕ Supprimer l'image
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span>🖼️</span>
                    <p>Cliquez pour sélectionner une image</p>
                    <p className="upload-hint">JPG, PNG, GIF, WEBP • Max 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>

          </div>

          {/* Résumé des contraintes 
          <div className="contraintes-info">
            <h4>📋 Contraintes pour chambre {formData.type.replace('_', ' ')}</h4>
            <div className="contraintes-grid">
              <span>💰 Prix : {contraintes.prix.min.toLocaleString('fr-FR')} - {contraintes.prix.max.toLocaleString('fr-FR')} FCFA</span>
              <span>📐 Superficie : {contraintes.superficie.min} - {contraintes.superficie.max} m²</span>
              <span>👥 Capacité : {contraintes.capacite.min} - {contraintes.capacite.max} pers.</span>
            </div>
          </div>
*/}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? ' Enregistrement...' : chambre ? ' Mettre à jour' : ' Créer la Chambre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChambreForm;