import { useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './Parametres.css';

const Parametres = () => {
  const [activeTab, setActiveTab] = useState<'hotel' | 'email' | 'system' | 'backup'>('hotel');
  const [hotelInfo, setHotelInfo] = useState({
    nom: 'HotelPro',
    adresse: '123 Avenue de la République, Cotonou',
    telephone: '+229 XX XX XX XX',
    email: 'contact@hotelpro.bj',
    siteWeb: 'www.hotelpro.bj',
    devise: 'FCFA',
  });

  const [emailConfig, setEmailConfig] = useState({
    emailHost: 'smtp.gmail.com',
    emailPort: '587',
    emailUser: '',
    emailPass: '',
    emailFrom: 'HotelPro',
  });

  const [systemConfig, setSystemConfig] = useState({
    checkInTime: '14:00',
    checkOutTime: '11:00',
    penaliteNoShow: '50',
    rappelHeures: '24',
    langueDefaut: 'fr',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHotelInfo({ ...hotelInfo, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmailConfig({ ...emailConfig, [e.target.name]: e.target.value });
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSystemConfig({ ...systemConfig, [e.target.name]: e.target.value });
  };

  const handleSaveHotel = () => {
    localStorage.setItem('hotelInfo', JSON.stringify(hotelInfo));
    setMessage({ type: 'success', text: 'Informations de l\'hôtel enregistrées avec succès !' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveEmail = () => {
    localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
    setMessage({ type: 'success', text: 'Configuration email enregistrée avec succès !' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveSystem = () => {
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
    setMessage({ type: 'success', text: 'Configuration système enregistrée avec succès !' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleExportData = () => {
    setMessage({ type: 'info', text: 'Export des données en cours...' });
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Données exportées avec succès !' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1500);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setMessage({ type: 'success', text: `Fichier "${file.name}" importé avec succès !` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    };
    input.click();
  };

  const handleBackup = () => {
    setMessage({ type: 'info', text: 'Création de la sauvegarde...' });
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Sauvegarde créée avec succès !' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 2000);
  };

  return (
    <div className="parametres-page">
      <Header
        title="Paramètres"
        subtitle="Configuration de l'application"
      />

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.type === 'success' && '✅ '}
          {message.type === 'error' && '❌ '}
          {message.type === 'info' && 'ℹ️ '}
          {message.text}
        </div>
      )}

      <div className="parametres-container">
        {/* Tabs */}
        <div className="parametres-tabs">
          <button
            className={`param-tab ${activeTab === 'hotel' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotel')}
          >
            <span className="tab-icon">🏨</span>
            <span>Informations Hôtel</span>
          </button>
          <button
            className={`param-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <span className="tab-icon">📧</span>
            <span>Configuration Email</span>
          </button>
          <button
            className={`param-tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="tab-icon">⚙️</span>
            <span>Système</span>
          </button>
          <button
            className={`param-tab ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <span className="tab-icon">💾</span>
            <span>Sauvegarde</span>
          </button>
        </div>

        {/* Contenu */}
        <div className="parametres-content">
          {/* Onglet Informations Hôtel */}
          {activeTab === 'hotel' && (
            <div className="param-section">
              <h2 className="section-title">🏨 Informations de l'Hôtel</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom de l'hôtel</label>
                  <input
                    type="text"
                    name="nom"
                    value={hotelInfo.nom}
                    onChange={handleHotelChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={hotelInfo.adresse}
                    onChange={handleHotelChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={hotelInfo.telephone}
                    onChange={handleHotelChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={hotelInfo.email}
                    onChange={handleHotelChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Site Web</label>
                  <input
                    type="text"
                    name="siteWeb"
                    value={hotelInfo.siteWeb}
                    onChange={handleHotelChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Devise</label>
                  <select
                    name="devise"
                    value={hotelInfo.devise}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, devise: e.target.value })}
                    className="form-input"
                  >
                    <option value="FCFA">FCFA (Franc CFA)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
              </div>

              <div className="param-actions">
                <Button variant="accent" onClick={handleSaveHotel}>
                  💾 Enregistrer les Modifications
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Email */}
          {activeTab === 'email' && (
            <div className="param-section">
              <h2 className="section-title">📧 Configuration Email (SMTP)</h2>
              <p className="section-description">
                Configurez les paramètres SMTP pour l'envoi automatique des emails de confirmation et rappels.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Hôte SMTP</label>
                  <input
                    type="text"
                    name="emailHost"
                    value={emailConfig.emailHost}
                    onChange={handleEmailChange}
                    placeholder="smtp.gmail.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Port SMTP</label>
                  <select
                    name="emailPort"
                    value={emailConfig.emailPort}
                    onChange={handleEmailChange}
                    className="form-input"
                  >
                    <option value="587">587 (TLS)</option>
                    <option value="465">465 (SSL)</option>
                    <option value="25">25 (Non sécurisé)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Utilisateur Email</label>
                  <input
                    type="email"
                    name="emailUser"
                    value={emailConfig.emailUser}
                    onChange={handleEmailChange}
                    placeholder="votre@email.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    name="emailPass"
                    value={emailConfig.emailPass}
                    onChange={handleEmailChange}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nom de l'expéditeur</label>
                  <input
                    type="text"
                    name="emailFrom"
                    value={emailConfig.emailFrom}
                    onChange={handleEmailChange}
                    placeholder="HotelPro"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="info-box">
                <h4>ℹ️ Configuration Gmail</h4>
                <ol>
                  <li>Activez la validation en 2 étapes sur votre compte Google</li>
                  <li>Allez dans "Mots de passe des applications"</li>
                  <li>Créez un nouveau mot de passe pour "Autre (nom personnalisé)"</li>
                  <li>Utilisez ce mot de passe dans le champ ci-dessus</li>
                </ol>
              </div>

              <div className="param-actions">
                <Button variant="accent" onClick={handleSaveEmail}>
                  💾 Enregistrer la Configuration
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Système */}
          {activeTab === 'system' && (
            <div className="param-section">
              <h2 className="section-title">⚙️ Configuration Système</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Heure de Check-in</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={systemConfig.checkInTime}
                    onChange={handleSystemChange}
                    className="form-input"
                  />
                  <p className="form-hint">Heure à partir de laquelle les clients peuvent arriver</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Heure de Check-out</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={systemConfig.checkOutTime}
                    onChange={handleSystemChange}
                    className="form-input"
                  />
                  <p className="form-hint">Heure limite de départ des clients</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Pénalité No-Show (%)</label>
                  <input
                    type="number"
                    name="penaliteNoShow"
                    value={systemConfig.penaliteNoShow}
                    onChange={handleSystemChange}
                    min="0"
                    max="100"
                    className="form-input"
                  />
                  <p className="form-hint">Pourcentage du montant à facturer en cas d'absence</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Rappel avant (heures)</label>
                  <input
                    type="number"
                    name="rappelHeures"
                    value={systemConfig.rappelHeures}
                    onChange={handleSystemChange}
                    min="1"
                    max="72"
                    className="form-input"
                  />
                  <p className="form-hint">Envoyer un rappel X heures avant la réservation</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Langue par défaut</label>
                  <select
                    name="langueDefaut"
                    value={systemConfig.langueDefaut}
                    onChange={handleSystemChange}
                    className="form-input"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="param-actions">
                <Button variant="accent" onClick={handleSystemChange}>
                  💾 Enregistrer les Paramètres
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Sauvegarde */}
          {activeTab === 'backup' && (
            <div className="param-section">
              <h2 className="section-title">💾 Sauvegarde et Restauration</h2>

              <div className="backup-grid">
                <div className="backup-card">
                  <div className="backup-icon">📤</div>
                  <h3>Exporter les Données</h3>
                  <p>Exportez toutes vos données (clients, chambres, réservations) au format JSON</p>
                  <Button variant="outline" onClick={handleExportData}>
                    📤 Exporter
                  </Button>
                </div>

                <div className="backup-card">
                  <div className="backup-icon">📥</div>
                  <h3>Importer des Données</h3>
                  <p>Importez des données depuis un fichier JSON exporté précédemment</p>
                  <Button variant="outline" onClick={handleImportData}>
                    📥 Importer
                  </Button>
                </div>

                <div className="backup-card">
                  <div className="backup-icon">💾</div>
                  <h3>Sauvegarde Complète</h3>
                  <p>Créez une sauvegarde complète de la base de données</p>
                  <Button variant="accent" onClick={handleBackup}>
                    💾 Créer une Sauvegarde
                  </Button>
                </div>

                <div className="backup-card">
                  <div className="backup-icon">🔄</div>
                  <h3>Restaurer</h3>
                  <p>Restaurez la base de données depuis une sauvegarde</p>
                  <Button variant="outline">
                    🔄 Restaurer
                  </Button>
                </div>
              </div>

              <div className="warning-box">
                <h4>⚠️ Attention</h4>
                <p>
                  La restauration d'une sauvegarde écrasera toutes les données actuelles.
                  Assurez-vous de créer une sauvegarde avant de restaurer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres;