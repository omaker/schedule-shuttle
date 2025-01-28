import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { Ship, Weight, Calendar, Save, RefreshCw, ChevronRight, ChevronDown, Package, Building, MapPin, Anchor, Clock } from "lucide-react";
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
      <Card className="p-4 hover:bg-gray-50 transition-all border-l-4 border-l-mint-500 animate-fade-in">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5`}>
                <Ship className="w-3 h-3" />
                {item.status}
              </Badge>
              <span className="text-sm font-mono text-gray-500">#{item.no}</span>
            </div>
            <div className="flex items-center gap-2">
              {!exists ? (
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-md hover:bg-mint-50 text-mint-600 text-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1.5 rounded-md hover:bg-mint-50 text-mint-600 text-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Perbarui
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-mint-600" />
              <span className="text-sm font-medium text-mint-800">{item.jenisBarang || "Tidak ada data"}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Weight className="w-4 h-4 text-mint-600" />
              <span className="text-sm text-gray-600">{item.berat} ton</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-mint-600" />
            <span>{item.tanggalPengiriman}</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Pengirim:</p>
              <p className="text-sm font-medium">{item.namaPengirim || "Tidak ada data"}</p>
              <p className="text-sm text-gray-600">{item.alamatPengirim || "Tidak ada data"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Penerima:</p>
              <p className="text-sm font-medium">{item.namaPenerima || "Tidak ada data"}</p>
              <p className="text-sm text-gray-600">{item.alamatPenerima || "Tidak ada data"}</p>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg bg-white relative animate-fade-in border-t-4 border-t-mint-500">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5`}>
                  <Ship className="w-3 h-3" />
                  {item.status}
                </Badge>
                <span className="text-sm font-mono text-gray-500">#{item.no}</span>
              </div>
              {!exists ? (
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-md hover:bg-mint-50 text-mint-600 text-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1.5 rounded-md hover:bg-mint-50 text-mint-600 text-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Perbarui
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-mint-600" />
                <span className="text-base font-medium text-mint-800">{item.jenisBarang || "Tidak ada data"}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Weight className="w-4 h-4 text-mint-600" />
                <span className="text-sm text-gray-600">{item.berat} ton</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-mint-600" />
              <span>{item.tanggalPengiriman}</span>
            </div>
          </div>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-mint-800">Detail Pengiriman #{item.no}</h3>
            <Badge className={`${getStatusColor(item.status)} flex items-center gap-1.5 w-fit`}>
              <Ship className="w-3 h-3" />
              {item.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Pengirim:</p>
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-mint-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{item.namaPengirim || "Tidak ada data"}</p>
                    <p className="text-sm text-gray-600">{item.alamatPengirim || "Tidak ada data"}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Penerima:</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-mint-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{item.namaPenerima || "Tidak ada data"}</p>
                    <p className="text-sm text-gray-600">{item.alamatPenerima || "Tidak ada data"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Produk:</p>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-mint-600" />
                  <p className="text-sm font-medium">{item.jenisBarang || "Tidak ada data"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Berat:</p>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-mint-600" />
                  <p className="text-sm font-medium">{item.berat} ton</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Pengiriman:</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-mint-600" />
                  <p className="text-sm font-medium">{item.tanggalPengiriman}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};