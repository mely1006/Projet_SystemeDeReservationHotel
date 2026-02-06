// Utilitaire pour formater les montants en FCFA
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

// Convertir un montant pour l'affichage
export const displayAmount = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return formatCurrency(numAmount);
};

// Symbole de devise
export const CURRENCY_SYMBOL = 'FCFA';
export const CURRENCY_CODE = 'XAF';