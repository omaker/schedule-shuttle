import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formatShippingDate = (value: number | null) => {
  if (!value) return "Tidak ada data";
  
  // Extract month and day from the value
  // Example: V100001 where 1 is month (January) and 00001 is day (1)
  const valueStr = value.toString();
  const month = parseInt(valueStr[0]) - 1; // 0-based month
  const day = parseInt(valueStr.slice(1));
  
  try {
    const date = new Date(new Date().getFullYear(), month, day);
    return format(date, "d MMMM", { locale: id });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Format tanggal tidak valid";
  }
};

export const formatFinMonth = (value: number | null) => {
  if (!value) return "Tidak ada data";
  
  try {
    // Assuming fin_month is just a month number (1-12)
    const date = new Date(new Date().getFullYear(), value - 1, 1);
    return format(date, "MMMM", { locale: id });
  } catch (error) {
    console.error("Error formatting fin month:", error);
    return "Format bulan tidak valid";
  }
};