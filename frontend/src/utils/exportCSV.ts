import type { Chambre, Reservation, Client } from '../types';

// Fonction pour convertir des données en CSV
const convertToCSV = (data: any[], headers: string[]): string => {
  const headerRow = headers.join(',');
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Échapper les virgules et guillemets
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headerRow, ...rows].join('\n');
};

// Fonction pour télécharger un fichier CSV
const downloadCSV = (csvContent: string, filename: string) => {
  const BOM = '\uFEFF'; // UTF-8 BOM pour Excel
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export Chambres
export const exportChambresCSV = (chambres: Chambre[]) => {
  const data = chambres.map(chambre => ({
    'Numéro': chambre.numero,
    'Type': chambre.type,
    'Prix (FCFA)': chambre.prix,
    'Capacité': chambre.capacite,
    'Étage': chambre.etage,
    'Superficie (m²)': chambre.superficie,
    'Statut': chambre.statut,
    'Description': chambre.description || '',
  }));

  const headers = ['Numéro', 'Type', 'Prix (FCFA)', 'Capacité', 'Étage', 'Superficie (m²)', 'Statut', 'Description'];
  const csvContent = convertToCSV(data, headers);
  const filename = `chambres_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};

// Export Réservations
export const exportReservationsCSV = (reservations: Reservation[]) => {
  const data = reservations.map(reservation => ({
    'ID': reservation.id,
    'Client': `${reservation.client.prenom} ${reservation.client.nom}`,
    'Email Client': reservation.client.email,
    'Téléphone': reservation.client.telephone,
    'Chambre': reservation.chambre.numero,
    'Type Chambre': reservation.chambre.type,
    'Date Début': new Date(reservation.dateDebut).toLocaleDateString('fr-FR'),
    'Date Fin': new Date(reservation.dateFin).toLocaleDateString('fr-FR'),
    'Nombre Adultes': reservation.nombreAdultes,
    'Nombre Enfants': reservation.nombreEnfants,
    'Prix Total (FCFA)': reservation.prixTotal,
    'Statut': reservation.statut,
    'Demandes Spéciales': reservation.demandesSpeciales || '',
  }));

  const headers = [
    'ID', 'Client', 'Email Client', 'Téléphone', 'Chambre', 'Type Chambre',
    'Date Début', 'Date Fin', 'Nombre Adultes', 'Nombre Enfants',
    'Prix Total (FCFA)', 'Statut', 'Demandes Spéciales'
  ];
  
  const csvContent = convertToCSV(data, headers);
  const filename = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};

// Export Clients
export const exportClientsCSV = (clients: Client[]) => {
  const data = clients.map(client => ({
    'ID': client.id,
    'Prénom': client.prenom,
    'Nom': client.nom,
    'Email': client.email,
    'Téléphone': client.telephone,
    'Adresse': client.adresse || '',
    'Ville': client.ville || '',
    'Code Postal': client.codePostal || '',
    'Pays': client.pays || '',
    'Statut': client.statut,
    'Nombre Réservations': client.nombreReservations,
    'Dépenses Totales (FCFA)': client.depensesTotales,
    'Date Inscription': new Date(client.dateCreation).toLocaleDateString('fr-FR'),
  }));

  const headers = [
    'ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Ville',
    'Code Postal', 'Pays', 'Statut', 'Nombre Réservations',
    'Dépenses Totales (FCFA)', 'Date Inscription'
  ];
  
  const csvContent = convertToCSV(data, headers);
  const filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
};