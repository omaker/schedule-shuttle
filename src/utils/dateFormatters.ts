export const formatShippingDate = (month: number | null): string => {
  if (!month) return "Tidak ada data";
  
  // For shipping dates, the month field actually contains the day of the month
  const day = month;
  
  // Since we know this is January data
  const date = new Date(2024, 0, day); // 0 = January
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long'
  });
};

export const formatFinMonth = (finMonth: number | null): string => {
  if (!finMonth) return "Tidak ada data";
  
  // finMonth is 1-based (1 = January)
  const date = new Date(2024, finMonth - 1, 1);
  
  return date.toLocaleDateString('id-ID', {
    month: 'long'
  });
};