export interface ShippingItem {
  id: string;
  no: string;
  status: string;
  jenisBarang: string;
  berat: string | number;
  tanggalPengiriman: string;
  namaPengirim: string;
  alamatPengirim: string;
  namaPenerima: string;
  alamatPenerima: string;
  year?: string | number;
  month?: string | number;
  finMonth?: string | number;
  vessel?: string;
  shipCode?: string;
  region?: string;
  terminal?: string;
  contractPeriod?: string;
  priceCode?: string;
  // Adding the new properties
  price_fob_vessel?: number;
  revenue?: number;
  cv_typical?: number;
  cv_acceptable?: number;
}

export interface Column {
  title: string;
  items: ShippingItem[];
}

export interface Columns {
  [key: string]: Column;
}