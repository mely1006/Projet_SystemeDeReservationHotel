// Utilitaire pour formater les montants avec devise dynamique

// Récupérer la devise depuis localStorage
const getDevise = (): string => {
  try {
    const hotelInfo = localStorage.getItem('hotelInfo');
    if (hotelInfo) {
      const info = JSON.parse(hotelInfo);
      return info.devise || 'FCFA';
    }
  } catch (error) {
    console.error('Erreur lecture devise:', error);
  }
  return 'FCFA';
};

// Formater un montant avec la devise configurée
export const formatCurrency = (amount: number): string => {
  const devise = getDevise();
  
  // Formater selon la devise
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  // Retourner avec le symbole de devise
  switch (devise) {
    case 'EUR':
      return `${formatted} €`;
    case 'USD':
      return `${formatted} $`;
    case 'FCFA':
    default:
      return `${formatted} FCFA`;
  }
};

// Convertir un montant pour l'affichage
export const displayAmount = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return formatCurrency(numAmount);
};

// Obtenir le symbole de devise actuel
export const getCurrencySymbol = (): string => {
  const devise = getDevise();
  switch (devise) {
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    case 'FCFA':
    default:
      return 'FCFA';
  }
};

// Obtenir le code de devise actuel
export const getCurrencyCode = (): string => {
  const devise = getDevise();
  switch (devise) {
    case 'EUR':
      return 'EUR';
    case 'USD':
      return 'USD';
    case 'FCFA':
    default:
      return 'XAF';
  }
};

// Constantes (pour compatibilité)
export const CURRENCY_SYMBOL = 'FCFA';
export const CURRENCY_CODE = 'XAF';