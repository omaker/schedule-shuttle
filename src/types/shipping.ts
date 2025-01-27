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
}

export interface Column {
  title: string;
  items: ShippingItem[];
}

export interface Columns {
  [key: string]: Column;
}