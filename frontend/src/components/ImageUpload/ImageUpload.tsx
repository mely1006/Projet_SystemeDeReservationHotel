import { useState, useRef } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (10MB)
    if (file.size > 10* 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 10MB');
      return;
    }

    // Aperçu local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload serveur
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();

        formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur serveur upload:', errorData);
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      console.log('Upload réussi:', data);

      // retourne l'URL backend
      onImageUploaded(data.url);

    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Aperçu" />
          <div className="image-overlay">
            <button
              type="button"
              className="btn-change"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Changer
            </button>
            <button
              type="button"
              className="btn-remove"
              onClick={handleRemove}
              disabled={uploading}
            >
              Supprimer
            </button>
          </div>
          {uploading && <div className="upload-spinner">Upload en cours...</div>}
        </div>
      ) : (
        <div
          className="image-placeholder"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="placeholder-icon">📷</div>
          <div className="placeholder-text">
            Cliquez pour ajouter une photo
          </div>
          <div className="placeholder-hint">JPG, PNG, GIF - Max 10MB</div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
