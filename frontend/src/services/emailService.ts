import emailjs from '@emailjs/browser';


const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;      

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface ReservationEmailData {
  client_name: string;
  client_email: string;
  chambre_numero: string;
  chambre_type: string;
  date_debut: string;
  date_fin: string;
  nombre_adultes: number;
  prix_total: number;
  hotel_name?: string;
  hotel_telephone?: string;
  hotel_email?: string;
  hotel_website?: string;
}

export const sendConfirmationEmail = async (data: ReservationEmailData): Promise<boolean> => {
  try {
    // Récupérer les infos de l'hôtel depuis localStorage
    const hotelInfo = localStorage.getItem('hotelInfo');
    const hotel = hotelInfo ? JSON.parse(hotelInfo) : {};

    // Préparer les données du template
    const templateParams = {
      to_email: data.client_email,
      client_name: data.client_name,
      chambre_numero: data.chambre_numero,
      chambre_type: data.chambre_type,
      date_debut: new Date(data.date_debut).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      date_fin: new Date(data.date_fin).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      nombre_adultes: data.nombre_adultes,
      prix_total: data.prix_total.toLocaleString('fr-FR'),
      hotel_name: hotel.nom || 'HotelPro',
      hotel_telephone: hotel.telephone || '+229 XX XX XX XX',
      hotel_email: hotel.email || 'contact@hotelpro.bj',
      hotel_website: hotel.siteWeb || 'www.hotelpro.bj',
    };

    console.log('📧 Envoi email à:', data.client_email);
    
    // Envoyer l'email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email envoyé avec succès:', response);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return false;
  }
};

export default { sendConfirmationEmail };