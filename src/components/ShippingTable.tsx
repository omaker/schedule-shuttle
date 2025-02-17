import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, Loader2, Filter, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShippingCard } from "./ShippingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShippingTableProps {
  data: any[];
  showCombinedData?: boolean;
}

export const ShippingTable = ({ data, showCombinedData = false }: ShippingTableProps) => {
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

    if (showCombinedData) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [toast, showCombinedData]);

  const filterData = (dataArray: any[]) => 
    dataArray.filter(row => 
      Object.values(row).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in progress':
      case 'otw':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending':
      case 'not ok':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ok':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'unsold':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!showCombinedData) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Please upload an Excel file to view shipping schedules.
      </div>
    );
  }

  const filteredDbData = filterData(dbData);
  // Filter out Excel data that already exists in the database
  const newExcelData = data.filter(excelRow => 
    !dbData.some(dbRow => dbRow.excel_id === excelRow["EXCEL ID"])
  );
  const filteredExcelData = filterData(newExcelData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg border bg-card">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search shipping schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            className="w-28"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={view === "compact" ? "default" : "outline"}
            onClick={() => setView("compact")}
            className="w-28"
          >
            <List className="h-4 w-4 mr-2" />
            Compact
          </Button>
        </div>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="database">
            Database Records ({filteredDbData.length})
          </TabsTrigger>
          <TabsTrigger value="excel">
            New Excel Data ({filteredExcelData.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className={`
              ${view === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4" 
                : "flex flex-col gap-4 p-4"}
            `}>
              {filteredDbData.map((row, index) => (
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
        </TabsContent>

        <TabsContent value="excel">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className={`
              ${view === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4" 
                : "flex flex-col gap-4 p-4"}
            `}>
              {filteredExcelData.map((row, index) => (
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
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <span className="text-sm text-muted-foreground">
          Total: {filteredDbData.length + filteredExcelData.length} items
          ({filteredDbData.length} from database, {filteredExcelData.length} new from Excel)
        </span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Use search to filter results</span>
        </div>
      </div>
    </div>
  );
};

const mapRowToShippingItem = (row: any) => ({
  id: row["EXCEL ID"] || row.id || crypto.randomUUID(),
  no: row["EXCEL ID"] || row.excel_id || "",
  status: row["Loading Status"] || row.loading_status || "Pending",
  jenisBarang: row["Product"] || row.product || "Tidak ada data",
  berat: row["Plan Qty"] || row.plan_qty || 0,
  tanggalPengiriman: row["Laycan Start"] || row.laycan_start || "TBD",
  namaPengirim: row["Company"] || row.company || "Tidak ada data",
  alamatPengirim: row["Terminal"] || row.terminal || "Tidak ada data",
  namaPenerima: row["Base Customer"] || "Tidak ada data",
  alamatPenerima: row["Country"] || row.country || "Tidak ada data"
});