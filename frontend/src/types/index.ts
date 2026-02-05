// Types pour les Clients
export interface Client {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  statut: 'nouveau' | 'regulier' | 'vip';
  depensesTotales: number;
  nombreReservations: number;
  dateCreation: string;
  dateModification: string;
}

export interface CreateClientInput {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
}

// Types pour les Chambres
export interface Chambre {
  id: number;
  numero: string;
  type: 'standard' | 'double' | 'deluxe' | 'suite' | 'suite_presidentielle';
  prix: number;
  capacite: number;
  etage: number;
  superficie: number;
  description?: string;
  statut: 'disponible' | 'occupee' | 'maintenance';
  equipements?: string[];
  dateCreation: string;
  dateModification: string;
}

export interface CreateChambreInput {
  numero: string;
  type: 'standard' | 'double' | 'deluxe' | 'suite' | 'suite_presidentielle';
  prix: number;
  capacite: number;
  etage: number;
  superficie: number;
  description?: string;
  equipements?: string[];
}

// Types pour les Réservations
export interface Reservation {
  id: number;
  dateDebut: string;
  dateFin: string;
  heureArrivee?: string;
  heureDepart?: string;
  nombreAdultes: number;
  nombreEnfants: number;
  statut: 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
  prixTotal: number;
  demandesSpeciales?: string;
  notes?: string;
  dateCreation: string;
  dateModification: string;
  client: Client;
  clientId: number;
  chambre: Chambre;
  chambreId: number;
  paiements?: Paiement[];
}

export interface CreateReservationInput {
  dateDebut: string;
  dateFin: string;
  heureArrivee?: string;
  heureDepart?: string;
  nombreAdultes: number;
  nombreEnfants?: number;
  demandesSpeciales?: string;
  notes?: string;
  clientId: number;
  chambreId: number;
  prixTotal: number;
}

// Types pour les Paiements
export interface Paiement {
  id: number;
  montant: number;
  methode: 'carte_bancaire' | 'especes' | 'virement' | 'paypal';
  statut: 'en_attente' | 'valide' | 'rembourse' | 'echoue';
  notes?: string;
  datePaiement: string;
  reservationId: number;
  reservation?: Reservation;
}

export interface CreatePaiementInput {
  montant: number;
  methode: 'carte_bancaire' | 'especes' | 'virement' | 'paypal';
  notes?: string;
  reservationId: number;
}

// Types pour les Statistiques
export interface DashboardStats {
  reservations: {
    total: number;
    confirmees: number;
    enCours: number;
    terminees: number;
    annulees: number;
    revenusMois: number;
  };
  chambres: {
    total: number;
    disponibles: number;
    occupees: number;
    maintenance: number;
    tauxOccupation: string;
  };
  clients: {
    total: number;
    vip: number;
    reguliers: number;
    nouveaux: number;
  };
  checkInsToday: Reservation[];
  checkOutsToday: Reservation[];
}

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}