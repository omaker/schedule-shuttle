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
  // Adding the missing properties
  year?: string | number;
  month?: string | number;
  finMonth?: string | number;
  vessel?: string;
  shipCode?: string;
  region?: string;
  terminal?: string;
  contractPeriod?: string;
  priceCode?: string;
}

export interface Column {
  title: string;
  items: ShippingItem[];
}

export interface Columns {
  [key: string]: Column;
}