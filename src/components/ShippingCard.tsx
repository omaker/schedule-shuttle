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
    <Card className="p-4 transition-all transform hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex justify-between items-start mb-2">
        <Badge className={`${getStatusColor(item.status)} animate-fade-in flex items-center gap-1`}>
          <Ship className="w-3 h-3" />
          {item.status}
        </Badge>
        <span className="text-sm text-gray-500 font-mono">#{item.no}</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-mint-800">
          <Anchor className="w-4 h-4" />
          <p className="font-medium">{item.jenisBarang}</p>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-mint-600" />
            <p>{item.tanggalPengiriman}</p>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-mint-600" />
            <p>{item.berat} ton</p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">From Port:</p>
            <p className="font-medium">{item.namaPengirim} - {item.alamatPengirim}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">To Port:</p>
            <p className="font-medium">{item.namaPenerima} - {item.alamatPenerima}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};