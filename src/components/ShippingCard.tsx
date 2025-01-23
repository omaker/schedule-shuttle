import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
}

export const ShippingCard = ({ item, getStatusColor }: ShippingCardProps) => {
  return (
    <Card className="p-4 transition-all transform hover:shadow-lg hover:-translate-y-1">
      <div className="flex justify-between items-start mb-2">
        <Badge className={`${getStatusColor(item.status)} animate-fade-in`}>
          {item.status}
        </Badge>
        <span className="text-sm text-gray-500">#{item.no}</span>
      </div>
      <div className="space-y-2">
        <p className="font-medium text-mint-800">{item.jenisBarang}</p>
        <div className="text-sm text-gray-600">
          <p>From: {item.namaPengirim}</p>
          <p>To: {item.namaPenerima}</p>
          <p>Weight: {item.berat} kg</p>
        </div>
      </div>
    </Card>
  );
};