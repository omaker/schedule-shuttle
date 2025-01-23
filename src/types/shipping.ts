export interface ShippingItem {
  id: string;
  no: string;
  tanggalPengiriman: string;
  namaPengirim: string;
  alamatPengirim: string;
  namaPenerima: string;
  alamatPenerima: string;
  jenisBarang: string;
  berat: string;
  status: "pending" | "shipping" | "delivered";
}

export interface ColumnData {
  title: string;
  items: ShippingItem[];
}

export interface Columns {
  [key: string]: ColumnData;
}