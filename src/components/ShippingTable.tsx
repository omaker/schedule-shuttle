import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Search, Save, Loader2, Check, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ShippingSchedule = Database['public']['Tables']['shipping_schedules']['Insert'];

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dbData, setDbData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const headers = [
    "EXCEL ID", "Year", "Month", "Fin Month", "Product", "Laycan Status", "First ETA", "Vessel", "Company",
    "Laycan Start", "Laycan Stop", "ETA", "Commence", "ATC", "Terminal", "L/R", "Dem Rate", "Plan Qty",
    "Progress", "Act Qty", "LC MIN", "LC MAX", "Remark", "Est Des/(Dem)", "LC&CSA STATUS", "Total Qty",
    "Laydays", "Arrival", "Laytime Start", "Laytime Stop", "Act L/R", "Loading Status", "complete",
    "Laycan Part", "Laycan Period", "Ship Code", "Sales Status", "DY", "Incoterm",
    "Contract Period", "Direct / AIS", "Ship Code OMDB", "Country", "Sector", "Base Customer",
    "Region", "Price Code", "Fixed/Index Linked", "Pricing Period", "Barge Adj",
    "Settled/Floating", "Price (FOB Vessel)", "Price Adj Load Port", "Price Adj Load Port and CV",
    "Price FOB Vessel Adj CV", "Revenue", "Revenue Adj to Loadport", "Revenue adj to load port and CV",
    "Revenue FOB Vessel and CV", "CV Typical", "CV Rejection", "CV Acceptable",
    "Blending Proportion", "BC IUP", "BC Tonnage", "AI Tonnage", "BC CV", "AI CV", "Expected blended CV",
    "CV Typical x tonnage", "CV Rejection x tonnage", "CV Acceptable x tonnage", "PIT",
    "Product Marketing", "Price code non-capped", "Price non-capped",
    "Price non-capped Adj LP CV Acc", "Revenue non-capped Adj LP CV Acc", "CV AR", "TM", "TS ADB",
    "ASH AR", "HPB Cap", "HBA 2", "HPB Market", "BLU Tarif", "Pungutan BLU", "Revenue Capped",
    "Revenue Non-Capped", "Incremental Revenue", "Net BLU Expense/(Income)"
  ];

  const filteredData = data.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const isRowInDatabase = (row: any) => {
    return dbData.some(dbRow => dbRow.excel_id === row["EXCEL ID"]);
  };

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

  const renderStatusCell = (value: string) => (
    <Badge className={getStatusColor(value)}>
      {value || 'No Status'}
    </Badge>
  );

  const handleSaveRow = async (rowData: any) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Authentication error:", sessionError);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to save data",
        });
        return;
      }

      console.log("Saving/Updating row data:", rowData);

      const mappedData: ShippingSchedule = {
        excel_id: rowData["EXCEL ID"],
        year: rowData["Year"] ? Number(rowData["Year"]) : null,
        month: rowData["Month"] ? Number(rowData["Month"]) : null,
        fin_month: rowData["Fin Month"] ? Number(rowData["Fin Month"]) : null,
        product: rowData["Product"] || null,
        laycan_status: rowData["Laycan Status"] || null,
        vessel: rowData["Vessel"] || null,
        company: rowData["Company"] || null,
        laycan_start: rowData["Laycan Start"] ? Number(rowData["Laycan Start"]) : null,
        laycan_stop: rowData["Laycan Stop"] ? Number(rowData["Laycan Stop"]) : null,
        eta: rowData["ETA"] ? Number(rowData["ETA"]) : null,
        terminal: rowData["Terminal"] || null,
        plan_qty: rowData["Plan Qty"] ? Number(rowData["Plan Qty"]) : null,
        lcsa_status: rowData["LC&CSA STATUS"] || null,
        total_qty: rowData["Total Qty"] ? Number(rowData["Total Qty"]) : null,
        laydays: rowData["Laydays"] ? Number(rowData["Laydays"]) : null,
        arrival: rowData["Arrival"] || null,
        laytime_start: rowData["Laytime Start"] ? Number(rowData["Laytime Start"]) : null,
        laytime_stop: rowData["Laytime Stop"] ? Number(rowData["Laytime Stop"]) : null,
        act_lr: rowData["Act L/R"] || null,
        loading_status: rowData["Loading Status"] || null,
        complete: rowData["complete"] ? Number(rowData["complete"]) : null,
        laycan_part: rowData["Laycan Part"] || null,
        laycan_period: rowData["Laycan Period"] ? Number(rowData["Laycan Period"]) : null,
        ship_code: rowData["Ship Code"] || null,
        sales_status: rowData["Sales Status"] || null,
        dy: rowData["DY"] ? Number(rowData["DY"]) : null,
        incoterm: rowData["Incoterm"] || null,
        contract_period: rowData["Contract Period"] || null,
        direct_ais: rowData["Direct / AIS"] || null,
        ship_code_omdb: rowData["Ship Code OMDB"] || null,
        country: rowData["Country"] || null,
        region: rowData["Region"] || null,
        price_code: rowData["Price Code"] || null,
        fixed_index_linked: rowData["Fixed/Index Linked"] || null,
        pricing_period: rowData["Pricing Period"] || null,
        settled_floating: rowData["Settled/Floating"] || null,
        price_fob_vessel: rowData["Price (FOB Vessel)"] ? Number(rowData["Price (FOB Vessel)"]) : null,
        price_adj_load_port: rowData["Price Adj Load Port"] ? Number(rowData["Price Adj Load Port"]) : null,
        price_adj_load_port_cv: rowData["Price Adj Load Port and CV"] ? Number(rowData["Price Adj Load Port and CV"]) : null,
        price_fob_vessel_adj_cv: rowData["Price FOB Vessel Adj CV"] ? Number(rowData["Price FOB Vessel Adj CV"]) : null,
        revenue: rowData["Revenue"] ? Number(rowData["Revenue"]) : null,
        revenue_adj_loadport: rowData["Revenue Adj to Loadport"] ? Number(rowData["Revenue Adj to Loadport"]) : null,
        revenue_adj_load_port_cv: rowData["Revenue adj to load port and CV"] ? Number(rowData["Revenue adj to load port and CV"]) : null,
        revenue_fob_vessel_cv: rowData["Revenue FOB Vessel and CV"] ? Number(rowData["Revenue FOB Vessel and CV"]) : null,
        cv_typical: rowData["CV Typical"] ? Number(rowData["CV Typical"]) : null,
        cv_acceptable: rowData["CV Acceptable"] ? Number(rowData["CV Acceptable"]) : null,
        bc_iup: rowData["BC IUP"] || null,
        bc_tonnage: rowData["BC Tonnage"] ? Number(rowData["BC Tonnage"]) : null,
        ai_tonnage: rowData["AI Tonnage"] ? Number(rowData["AI Tonnage"]) : null,
        bc_cv: rowData["BC CV"] ? Number(rowData["BC CV"]) : null,
        ai_cv: rowData["AI CV"] ? Number(rowData["AI CV"]) : null,
        expected_blended_cv: rowData["Expected blended CV"] ? Number(rowData["Expected blended CV"]) : null,
        cv_typical_tonnage: rowData["CV Typical x tonnage"] ? Number(rowData["CV Typical x tonnage"]) : null,
        cv_rejection_tonnage: rowData["CV Rejection x tonnage"] ? Number(rowData["CV Rejection x tonnage"]) : null,
        cv_acceptable_tonnage: rowData["CV Acceptable x tonnage"] ? Number(rowData["CV Acceptable x tonnage"]) : null,
        pit: rowData["PIT"] || null,
        product_marketing: rowData["Product Marketing"] || null,
        price_code_non_capped: rowData["Price code non-capped"] || null,
        price_non_capped: rowData["Price non-capped"] ? Number(rowData["Price non-capped"]) : null,
        price_non_capped_adj_lp_cv_acc: rowData["Price non-capped Adj LP CV Acc"] ? Number(rowData["Price non-capped Adj LP CV Acc"]) : null,
        revenue_non_capped_adj_lp_cv_acc: rowData["Revenue non-capped Adj LP CV Acc"] ? Number(rowData["Revenue non-capped Adj LP CV Acc"]) : null,
        cv_ar: rowData["CV AR"] ? Number(rowData["CV AR"]) : null,
        tm: rowData["TM"] ? Number(rowData["TM"]) : null,
        ts_adb: rowData["TS ADB"] ? Number(rowData["TS ADB"]) : null,
        ash_ar: rowData["ASH AR"] ? Number(rowData["ASH AR"]) : null,
        hpb_cap: rowData["HPB Cap"] ? Number(rowData["HPB Cap"]) : null,
        hba_2: rowData["HBA 2"] ? Number(rowData["HBA 2"]) : null,
        hpb_market: rowData["HPB Market"] ? Number(rowData["HPB Market"]) : null,
        blu_tarif: rowData["BLU Tarif"] ? Number(rowData["BLU Tarif"]) : null,
        pungutan_blu: rowData["Pungutan BLU"] ? Number(rowData["Pungutan BLU"]) : null,
        revenue_capped: rowData["Revenue Capped"] ? Number(rowData["Revenue Capped"]) : null,
        revenue_non_capped: rowData["Revenue Non-Capped"] ? Number(rowData["Revenue Non-Capped"]) : null,
        incremental_revenue: rowData["Incremental Revenue"] ? Number(rowData["Incremental Revenue"]) : null,
        net_blu_expense_income: rowData["Net BLU Expense/(Income)"] ? Number(rowData["Net BLU Expense/(Income)"]) : null
      };

      console.log("Mapped data:", mappedData);

      const existingRow = dbData.find(item => item.excel_id === mappedData.excel_id);
      let result;

      if (existingRow) {
        result = await supabase
          .from('shipping_schedules')
          .update(mappedData)
          .eq('excel_id', mappedData.excel_id);
        
        console.log("Updating existing record:", result);
      } else {
        result = await supabase
          .from('shipping_schedules')
          .insert(mappedData);
        
        console.log("Inserting new record:", result);
      }

      const { error } = result;

      if (error) {
        console.error("Error saving/updating data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: existingRow ? "Failed to update data" : "Failed to save data",
        });
        return;
      }

      const { data: updatedData } = await supabase
        .from('shipping_schedules')
        .select('*');
      
      if (updatedData) {
        setDbData(updatedData);
      }

      toast({
        title: "Success",
        description: existingRow ? "Data updated successfully" : "Data saved successfully",
      });
    } catch (error) {
      console.error("Error saving/updating data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save/update data",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint-600" />
      </div>
    );
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollLeft);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search in table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <ScrollArea className="h-[600px] rounded-md" onScroll={handleScroll}>
          <div className="relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-white w-[200px]">
                    Status & Actions
                  </TableHead>
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index}
                      className="min-w-[150px] bg-white py-4 text-left text-sm font-medium text-gray-900"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => {
                  const savedInDb = isRowInDatabase(row);
                  return (
                    <TableRow 
                      key={rowIndex}
                      className="group hover:bg-gray-50 transition-colors relative"
                    >
                      <TableCell className="w-[200px] bg-white group-hover:bg-gray-50">
                        <div 
                          className="flex items-center gap-2 p-2"
                          style={{
                            position: 'absolute',
                            left: `${scrollPosition}px`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 40,
                            transition: 'left 0.1s ease-out',
                            backgroundColor: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger>
                              {savedInDb ? (
                                <Badge variant="outline" className="bg-green-50 border-green-200">
                                  <Check className="h-4 w-4 text-green-500 mr-1" />
                                  Saved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
                                  <X className="h-4 w-4 text-yellow-500 mr-1" />
                                  Not Saved
                                </Badge>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {savedInDb ? 'Click Update to modify data' : 'Click Save to store in database'}
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            variant={savedInDb ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleSaveRow(row)}
                            className={`
                              transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap
                              ${savedInDb 
                                ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200' 
                                : 'bg-mint-500 hover:bg-mint-600 text-white'}
                            `}
                          >
                            {savedInDb ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Update
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      {headers.map((header, colIndex) => (
                        <TableCell 
                          key={`${rowIndex}-${colIndex}`}
                          className={`whitespace-nowrap py-4 px-4 text-sm ${
                            !['Laycan Status', 'LC&CSA STATUS', 'Loading Status', 'Sales Status'].includes(header) && !isNaN(row[header]) && row[header] !== "" 
                              ? 'text-right font-mono' 
                              : 'text-left'
                          }`}
                        >
                          {['Laycan Status', 'LC&CSA STATUS', 'Loading Status', 'Sales Status'].includes(header) 
                            ? renderStatusCell(row[header]) 
                            : (row[header] || '-')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
};