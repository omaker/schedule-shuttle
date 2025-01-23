import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { Ship, Anchor, Weight, Calendar } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ShippingCard = ({ item, getStatusColor, isSelected }: ShippingCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className={`p-2 transition-all transform hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-slate-50 to-slate-100 ${
          isSelected ? 'ring-2 ring-mint-500 bg-mint-50' : ''
        }`}>
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
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(item.status)} animate-fade-in`}>
              <Ship className="w-4 h-4 mr-1" />
              {item.status}
            </Badge>
            <span className="text-sm font-mono">#{item.no}</span>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-semibold text-mint-800 flex items-center gap-2">
              <Anchor className="w-4 h-4" />
              {item.jenisBarang}
            </h4>
            <p className="text-sm flex items-center gap-2">
              <Weight className="w-4 h-4 text-mint-600" />
              {item.berat} ton
            </p>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-mint-600" />
              {item.tanggalPengiriman}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div>
              <p className="text-sm font-medium text-gray-500">From:</p>
              <p className="text-sm">{item.namaPengirim}</p>
              <p className="text-sm text-gray-600">{item.alamatPengirim}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">To:</p>
              <p className="text-sm">{item.namaPenerima}</p>
              <p className="text-sm text-gray-600">{item.alamatPenerima}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
