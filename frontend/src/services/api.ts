import axios from 'axios';
import type {
  Client,
  CreateClientInput,
  Chambre,
  CreateChambreInput,
  Reservation,
  CreateReservationInput,
  Paiement,
  CreatePaiementInput,
  DashboardStats,
  PaginatedResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== CLIENTS =====
export const clientsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
  }): Promise<PaginatedResponse<Client>> => {
    console.log('API getAll clients - params:', params);
    console.log('API URL:', `${API_BASE_URL}/clients`);
    const { data } = await api.get('/clients', { params });
    console.log('API getAll clients - réponse:', data);
    return data;
  },

  getById: async (id: number): Promise<Client> => {
    console.log('API getById client:', id);
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  create: async (client: CreateClientInput): Promise<Client> => {
    console.log('API create client - données:', client);
    try {
      const { data } = await api.post('/clients', client);
      console.log('API create client - réponse:', data);
      return data;
    } catch (error: any) {
      console.error('API create client - erreur:', error.response?.data);
      throw error;
    }
  },

  update: async (id: number, client: Partial<CreateClientInput>): Promise<Client> => {
    const { data } = await api.patch(`/clients/${id}`, client);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  getStats: async () => {
    const { data } = await api.get('/clients/stats');
    return data;
  },
};

// ===== CHAMBRES =====
export const chambresAPI = {
  getAll: async (params?: {
    statut?: string;
    type?: string;
    etage?: number;
  }): Promise<Chambre[]> => {
    const { data } = await api.get('/chambres', { params });
    return data;
  },

  getById: async (id: number): Promise<Chambre> => {
    const { data } = await api.get(`/chambres/${id}`);
    return data;
  },

  create: async (chambre: CreateChambreInput): Promise<Chambre> => {
    const { data } = await api.post('/chambres', chambre);
    return data;
  },

  update: async (id: number, chambre: Partial<CreateChambreInput>): Promise<Chambre> => {
    const { data } = await api.patch(`/chambres/${id}`, chambre);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/chambres/${id}`);
  },

  getDisponibles: async (dateDebut: string, dateFin: string): Promise<Chambre[]> => {
    const { data } = await api.get('/chambres/disponibles', {
      params: { dateDebut, dateFin },
    });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/chambres/stats');
    return data;
  },
};

// ===== RÉSERVATIONS =====
export const reservationsAPI = {
  getAll: async (params?: {
    statut?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<Reservation[]> => {
    const { data } = await api.get('/reservations', { params });
    return data;
  },

  getById: async (id: number): Promise<Reservation> => {
    const { data } = await api.get(`/reservations/${id}`);
    return data;
  },

  create: async (reservation: CreateReservationInput): Promise<Reservation> => {
    const { data } = await api.post('/reservations', reservation);
    return data;
  },

  update: async (
    id: number,
    reservation: Partial<CreateReservationInput>,
  ): Promise<Reservation> => {
    const { data } = await api.patch(`/reservations/${id}`, reservation);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },

  getByClient: async (clientId: number): Promise<Reservation[]> => {
    const { data } = await api.get(`/reservations/client/${clientId}`);
    return data;
  },

  getByChambre: async (
    chambreId: number,
    dateDebut?: string,
    dateFin?: string,
  ): Promise<Reservation[]> => {
    const { data } = await api.get(`/reservations/chambre/${chambreId}`, {
      params: { dateDebut, dateFin },
    });
    return data;
  },

  getCheckInsToday: async (): Promise<Reservation[]> => {
    const { data } = await api.get('/reservations/check-ins-today');
    return data;
  },

  getCheckOutsToday: async (): Promise<Reservation[]> => {
    const { data } = await api.get('/reservations/check-outs-today');
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/reservations/stats');
    return data;
  },
};

// ===== PAIEMENTS =====
export const paiementsAPI = {
  getAll: async (): Promise<Paiement[]> => {
    const { data } = await api.get('/paiements');
    return data;
  },

  getById: async (id: number): Promise<Paiement> => {
    const { data } = await api.get(`/paiements/${id}`);
    return data;
  },

  getByReservation: async (reservationId: number): Promise<Paiement[]> => {
    const { data } = await api.get(`/paiements/reservation/${reservationId}`);
    return data;
  },

  create: async (paiement: CreatePaiementInput): Promise<Paiement> => {
    const { data } = await api.post('/paiements', paiement);
    return data;
  },

  update: async (id: number, paiement: Partial<CreatePaiementInput>): Promise<Paiement> => {
    const { data } = await api.patch(`/paiements/${id}`, paiement);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/paiements/${id}`);
  },

  getStats: async () => {
    const { data } = await api.get('/paiements/stats');
    return data;
  },
};

// ===== DASHBOARD =====
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const [reservations, chambres, clients, checkInsToday, checkOutsToday] =
      await Promise.all([
        reservationsAPI.getStats(),
        chambresAPI.getStats(),
        clientsAPI.getStats(),
        reservationsAPI.getCheckInsToday(),
        reservationsAPI.getCheckOutsToday(),
      ]);

    return {
      reservations,
      chambres,
      clients,
      checkInsToday,
      checkOutsToday,
    };
  },
};

export default api;