import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, Loader2, Filter, LayoutGrid, List, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShippingCard } from "./ShippingCard";
import { Button } from "@/components/ui/button";

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dbData, setDbData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "compact">("grid");
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
        return 'bg-green-500/20 text-green-300';
      case 'in progress':
      case 'otw':
        return 'bg-blue-500/20 text-blue-300';
      case 'pending':
      case 'not ok':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'ok':
        return 'bg-green-500/20 text-green-300';
      case 'unsold':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm border border-slate-700">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search shipping schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 text-blue-100 placeholder:text-blue-300/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            className={`w-28 gap-2 ${
              view === "grid" 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "border-blue-500 text-blue-400 hover:bg-blue-500/20"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={view === "compact" ? "default" : "outline"}
            onClick={() => setView("compact")}
            className={`w-28 gap-2 ${
              view === "compact" 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "border-blue-500 text-blue-400 hover:bg-blue-500/20"
            }`}
          >
            <List className="h-4 w-4" />
            Compact
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg bg-slate-900/50 backdrop-blur-sm">
        <div className={`
          ${view === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"}
          p-6
        `}>
          {filteredData.map((row, index) => (
            <ShippingCard
              key={index}
              item={mapRowToShippingItem(row)}
              getStatusColor={getStatusColor}
              view={view}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm border border-slate-700">
        <span className="text-sm text-blue-300">
          Showing {filteredData.length} of {data.length} entries
        </span>
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <Filter className="h-4 w-4" />
          <span>Use search to filter results</span>
        </div>
      </div>
    </div>
  );
};

const mapRowToShippingItem = (row: any) => ({
  id: row["EXCEL ID"] || row.id || crypto.randomUUID(),
  no: row["EXCEL ID"] || "",
  status: row["Loading Status"] || "Pending",
  jenisBarang: row["Product"] || "Tidak ada data",
  berat: row["Plan Qty"] || 0,
  tanggalPengiriman: row["Laycan Start"] || "TBD",
  namaPengirim: row["Company"] || "Tidak ada data",
  alamatPengirim: row["Terminal"] || "Tidak ada data",
  namaPenerima: row["Base Customer"] || "Tidak ada data",
  alamatPenerima: row["Country"] || "Tidak ada data",
  year: row["Year"] || "Tidak ada data",
  month: row["Month"] || "Tidak ada data",
  finMonth: row["Fin Month"] || "Tidak ada data",
  vessel: row["Vessel"] || "Tidak ada data",
  shipCode: row["Ship Code"] || "Tidak ada data",
  region: row["Region"] || "Tidak ada data",
  terminal: row["Terminal"] || "Tidak ada data",
  contractPeriod: row["Contract Period"] || "Tidak ada data",
  priceCode: row["Price Code"] || "Tidak ada data",
  price_fob_vessel: row["Price FOB Vessel"] || null,
  revenue: row["Revenue"] || null,
  cv_typical: row["CV Typical"] || null,
  cv_acceptable: row["CV Acceptable"] || null
});