import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, Loader2, Filter, LayoutGrid, List } from "lucide-react";
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
    // Adding the new properties
    price_fob_vessel: row["Price FOB Vessel"] || null,
    revenue: row["Revenue"] || null,
    cv_typical: row["CV Typical"] || null,
    cv_acceptable: row["CV Acceptable"] || null
  });

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-mint-50 p-8 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search shipping schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            className="w-28 gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={view === "compact" ? "default" : "outline"}
            onClick={() => setView("compact")}
            className="w-28 gap-2"
          >
            <List className="h-4 w-4" />
            Compact
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg bg-white/50 backdrop-blur-sm">
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

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <span className="text-sm text-gray-500">
          Showing {filteredData.length} of {data.length} entries
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Use search to filter results</span>
        </div>
      </div>
    </div>
  );
};