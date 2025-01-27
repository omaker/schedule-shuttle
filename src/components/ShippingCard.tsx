import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { Ship, Anchor, Weight, Calendar, Save, RefreshCw, ChevronRight, ChevronDown } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
  view: "grid" | "compact";
}

export const ShippingCard = ({ item, getStatusColor, view }: ShippingCardProps) => {
  const { toast } = useToast();
  const [exists, setExists] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkIfExists = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_schedules')
          .select()
          .eq('excel_id', item.no)
          .maybeSingle();

        if (error) throw error;
        setExists(!!data);
      } catch (error) {
        console.error('Error checking data:', error);
      }
    };

    checkIfExists();
  }, [item.no]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('shipping_schedules')
        .insert({
          excel_id: item.no,
          product: item.jenisBarang,
          loading_status: item.status,
          plan_qty: Number(item.berat),
          laycan_start: Number(item.tanggalPengiriman),
          company: item.namaPengirim,
          terminal: item.alamatPengirim,
          country: item.alamatPenerima
        });

      if (error) throw error;

      setExists(true);
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
      const { error } = await supabase
        .from('shipping_schedules')
        .update({
          product: item.jenisBarang,
          loading_status: item.status,
          plan_qty: Number(item.berat),
          laycan_start: Number(item.tanggalPengiriman),
          company: item.namaPengirim,
          terminal: item.alamatPengirim,
          country: item.alamatPenerima
        })
        .eq('excel_id', item.no);

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

  if (view === "compact") {
    return (
      <Card 
        className="p-4 hover:bg-gray-50 transition-all border-l-4 border-l-mint-500 cursor-pointer animate-fade-in" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5`}>
              <Ship className="w-3 h-3" />
              {item.status}
            </Badge>
            <span className="text-sm font-medium text-mint-800">{item.jenisBarang}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{item.berat} ton</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">From:</p>
                <p>{item.namaPengirim}</p>
                <p className="text-gray-500">{item.alamatPengirim}</p>
              </div>
              <div>
                <p className="font-medium">To:</p>
                <p>{item.namaPenerima}</p>
                <p className="text-gray-500">{item.alamatPenerima}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group p-6 transition-all hover:-translate-y-1 hover:shadow-lg bg-white relative animate-fade-in border-t-4 border-t-mint-500">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {!exists ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSave();
                }}
                className="p-2 hover:bg-mint-100 rounded-full transition-colors"
                title="Save"
              >
                <Save className="w-5 h-5 text-mint-600" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpdate();
                }}
                className="p-2 hover:bg-mint-100 rounded-full transition-colors"
                title="Update"
              >
                <RefreshCw className="w-5 h-5 text-mint-600" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5 text-sm px-3 py-1`}>
                <Ship className="w-4 h-4" />
                {item.status}
              </Badge>
              <span className="text-sm text-gray-500 font-mono">#{item.no}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-mint-800">
                  <Anchor className="w-4 h-4" />
                  <p className="text-base font-medium truncate max-w-[200px]">{item.jenisBarang}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Weight className="w-4 h-4 text-mint-600" />
                  <p>{item.berat} ton</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-mint-600" />
                {item.tanggalPengiriman}
              </div>
            </div>
          </div>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(item.status)}`}>
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