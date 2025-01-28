import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShippingItem } from "@/types/shipping";
import { 
  Ship, Weight, Calendar, Save, RefreshCw, ChevronRight, ChevronDown, 
  Package, Building, MapPin, Rocket, ArrowUpRight, Edit, Trash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditShippingModal } from "./EditShippingModal";

interface ShippingCardProps {
  item: ShippingItem;
  getStatusColor: (status: string) => string;
  view: "grid" | "compact";
  onDelete?: () => void;
  onUpdate?: () => void;
}

export const ShippingCard = ({ item, getStatusColor, view, onDelete, onUpdate }: ShippingCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [exists, setExists] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('shipping_schedules')
        .delete()
        .eq('excel_id', item.no);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipping record deleted successfully",
      });
      onDelete?.();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete shipping record",
      });
    }
  };

  if (view === "compact") {
    return (
      <Card className="relative group cursor-pointer overflow-hidden">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-[10px]">
                #{item.no}
              </Badge>
              <Badge className={`text-[10px] ${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
            </div>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className="w-3 h-3" />
                <span>Product</span>
              </div>
              <p className="text-xs font-medium truncate">{item.jenisBarang || "N/A"}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Weight className="w-3 h-3" />
                <span>Weight</span>
              </div>
              <p className="text-xs font-medium">{item.berat} ton</p>
            </div>
          </div>

          <div className="pt-1.5 border-t space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{item.tanggalPengiriman}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Building className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{item.namaPengirim || "N/A"}</span>
            </div>
          </div>

          <div className="flex justify-end gap-1.5">
            {!exists ? (
              <button
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                <Save className="w-2.5 h-2.5" />
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Edit className="w-2.5 h-2.5" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive flex items-center gap-1"
                >
                  <Trash className="w-2.5 h-2.5" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        <EditShippingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={item}
          onUpdate={() => {
            onUpdate?.();
            setIsEditModalOpen(false);
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="relative group cursor-pointer overflow-hidden h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              #{item.no}
            </Badge>
            <Badge className={getStatusColor(item.status)}>
              <Ship className="w-3 h-3 mr-1" />
              {item.status}
            </Badge>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="w-3 h-3" />
              <span>Product Details</span>
            </div>
            <p className="text-sm font-medium line-clamp-2">{item.jenisBarang || "N/A"}</p>
            <div className="flex items-center gap-1.5 text-xs">
              <Weight className="w-3 h-3 text-muted-foreground" />
              <span>{item.berat} ton</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Shipping Schedule</span>
            </div>
            <p className="text-xs font-medium">{item.tanggalPengiriman}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building className="w-3 h-3" />
              <span>Sender</span>
            </div>
            <p className="text-xs font-medium line-clamp-1">{item.namaPengirim || "N/A"}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{item.alamatPengirim || "N/A"}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Recipient</span>
            </div>
            <p className="text-xs font-medium line-clamp-1">{item.namaPenerima || "N/A"}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{item.alamatPenerima || "N/A"}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          {!exists ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3 h-3" />
              Save to Database
            </button>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
                className="text-xs px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-xs px-2 py-1 rounded-md bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive flex items-center gap-1.5"
              >
                <Trash className="w-3 h-3" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <EditShippingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={item}
        onUpdate={() => {
          onUpdate?.();
          setIsEditModalOpen(false);
        }}
      />
    </Card>
  );
};
