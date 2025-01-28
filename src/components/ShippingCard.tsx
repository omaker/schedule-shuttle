import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { 
  Ship, Weight, Calendar, Save, RefreshCw, ChevronRight, ChevronDown, 
  Package, Building, MapPin, Rocket
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
  view: "grid" | "compact";
}

export const ShippingCard = ({ item, getStatusColor, view }: ShippingCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    navigate(`/shipping/${item.no}`);
  };

  if (view === "compact") {
    return (
      <Card 
        className="p-4 hover:bg-gradient-to-r from-slate-900 to-slate-800 transition-all border-l-4 border-l-blue-500 animate-fade-in cursor-pointer bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20"
        onClick={handleCardClick}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5 bg-blue-500/20 text-blue-300`}>
                <Ship className="w-3 h-3" />
                {item.status}
              </Badge>
              <span className="text-sm font-mono text-blue-300/70">#{item.no}</span>
            </div>
            <div className="flex items-center gap-2">
              {!exists ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  className="px-3 py-1.5 rounded-md hover:bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpdate(); }}
                  className="px-3 py-1.5 rounded-md hover:bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Perbarui
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-100">{item.jenisBarang || "Tidak ada data"}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Weight className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">{item.berat} ton</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-300/70">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{item.tanggalPengiriman}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-blue-800/50 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-blue-400 mb-1">Pengirim:</p>
              <p className="text-sm font-medium text-blue-100">{item.namaPengirim || "Tidak ada data"}</p>
              <p className="text-sm text-blue-300">{item.alamatPengirim || "Tidak ada data"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-400 mb-1">Penerima:</p>
              <p className="text-sm font-medium text-blue-100">{item.namaPenerima || "Tidak ada data"}</p>
              <p className="text-sm text-blue-300">{item.alamatPenerima || "Tidak ada data"}</p>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card 
      className="p-6 transition-all hover:-translate-y-1 hover:shadow-xl bg-slate-900/90 backdrop-blur-sm relative animate-fade-in border-t-4 border-t-blue-500 cursor-pointer hover:shadow-blue-500/20 group"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative z-10">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5 bg-blue-500/20 text-blue-300`}>
                <Ship className="w-3 h-3" />
                {item.status}
              </Badge>
              <span className="text-sm font-mono text-blue-300/70">#{item.no}</span>
            </div>
            {!exists ? (
              <button
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="px-3 py-1.5 rounded-md hover:bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); handleUpdate(); }}
                className="px-3 py-1.5 rounded-md hover:bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Perbarui
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-base font-medium text-blue-100">{item.jenisBarang || "Tidak ada data"}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Weight className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">{item.berat} ton</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-300/70">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{item.tanggalPengiriman}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-800/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100">{item.namaPengirim || "Tidak ada data"}</span>
              </div>
              <p className="text-sm text-blue-300 pl-6">{item.alamatPengirim || "Tidak ada data"}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100">{item.namaPenerima || "Tidak ada data"}</span>
              </div>
              <p className="text-sm text-blue-300 pl-6">{item.alamatPenerima || "Tidak ada data"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};