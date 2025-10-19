/**
 * Validação de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validação de telefone brasileiro
 */
export const isValidPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Validação de CPF
 */
export const isValidCPF = (cpf) => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

/**
 * Formatação de telefone
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Formatação de CPF
 */
export const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

/**
 * Sanitização de string para prevenir XSS
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validação de URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};