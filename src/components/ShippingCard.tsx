import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { Ship, Anchor, Weight, Calendar, Save, RefreshCw } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
}

export const ShippingCard = ({ item, getStatusColor }: ShippingCardProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('shipping_schedules')
        .upsert([{ 
          id: item.id,
          product: item.jenisBarang,
          loading_status: item.status,
          plan_qty: item.berat,
          laycan_start: item.tanggalPengiriman,
          company: item.namaPengirim,
          terminal: item.alamatPengirim,
          country: item.alamatPenerima
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil disimpan",
        description: "Data telah tersimpan ke database",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menyimpan data",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_schedules')
        .select()
        .eq('id', item.id)
        .single();

      if (error) throw error;

      toast({
        title: "Data diperbarui",
        description: "Data telah diperbarui dari database",
      });
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data",
      });
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="p-2 transition-all transform hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-slate-50 to-slate-100 relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="p-1 hover:bg-mint-100 rounded-full transition-colors"
              title="Save"
            >
              <Save className="w-4 h-4 text-mint-600" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="p-1 hover:bg-mint-100 rounded-full transition-colors"
              title="Update"
            >
              <RefreshCw className="w-4 h-4 text-mint-600" />
            </button>
          </div>

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