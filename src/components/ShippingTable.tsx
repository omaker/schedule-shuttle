import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShippingCard } from "./ShippingCard";

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dbData, setDbData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: schedules, error } = await supabase
          .from('shipping_schedules')
          .select('*');

        if (error) {
          console.error("Error fetching data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch shipping schedules",
          });
          return;
        }

        setDbData(schedules);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredData = data.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'otw':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'not ok':
        return 'bg-yellow-100 text-yellow-800';
      case 'ok':
        return 'bg-green-100 text-green-800';
      case 'unsold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint-600" />
      </div>
    );
  }

  const mapRowToShippingItem = (row: any) => ({
    id: row["EXCEL ID"] || row.id || crypto.randomUUID(),
    no: row["EXCEL ID"] || "",
    status: row["Loading Status"] || "Pending",
    jenisBarang: row["Product"] || "Unknown",
    berat: row["Plan Qty"] || 0,
    tanggalPengiriman: row["Laycan Start"] || "TBD",
    namaPengirim: row["Company"] || "Unknown",
    alamatPengirim: row["Terminal"] || "Unknown",
    namaPenerima: row["Base Customer"] || "Unknown",
    alamatPenerima: row["Country"] || "Unknown"
  });

  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search in cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm bg-white border-gray-200"
        />
      </div>

      <ScrollArea className="h-[600px] bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {filteredData.map((row, index) => (
            <ShippingCard
              key={index}
              item={mapRowToShippingItem(row)}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="text-sm text-gray-500 bg-white p-3 rounded-md shadow-sm">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
};