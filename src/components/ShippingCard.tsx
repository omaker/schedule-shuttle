import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { Ship, Anchor, Weight, Calendar } from "lucide-react";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
}

export const ShippingCard = ({ item, getStatusColor }: ShippingCardProps) => {
  return (
    <Card className="p-2 transition-all transform hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(item.status)} animate-fade-in flex items-center gap-1 text-xs`}>
            <Ship className="w-3 h-3" />
            {item.status}
          </Badge>
          <span className="text-xs text-gray-500 font-mono">#{item.no}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3 text-mint-600" />
          {item.tanggalPengiriman}
        </div>
      </div>
      
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1 text-mint-800">
          <Anchor className="w-3 h-3" />
          <p className="text-sm font-medium">{item.jenisBarang}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Weight className="w-3 h-3 text-mint-600" />
          <p>{item.berat} ton</p>
        </div>
      </div>
      
      <div className="mt-1 text-xs text-gray-600 grid grid-cols-2 gap-x-2">
        <div>
          <p className="text-gray-500">From:</p>
          <p className="font-medium truncate" title={`${item.namaPengirim} - ${item.alamatPengirim}`}>
            {item.namaPengirim} - {item.alamatPengirim}
          </p>
        </div>
        <div>
          <p className="text-gray-500">To:</p>
          <p className="font-medium truncate" title={`${item.namaPenerima} - ${item.alamatPenerima}`}>
            {item.namaPenerima} - {item.alamatPenerima}
          </p>
        </div>
      </div>
    </Card>
  );
};