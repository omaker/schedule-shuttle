export const formatShippingDate = (month: number | null): string => {
  if (!month) return "Tidak ada data";
  
  // Excel dates are counted from December 30, 1899
  const baseDate = new Date(1899, 11, 30); // December 30, 1899
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + Math.floor(month));
  
  return targetDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatFinMonth = (finMonth: number | null): string => {
  if (!finMonth) return "Tidak ada data";
  
  // Excel dates are counted from December 30, 1899
  const baseDate = new Date(1899, 11, 30); // December 30, 1899
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + Math.floor(finMonth));
  
  return targetDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
};