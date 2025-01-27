import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
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

  // Filter data based on search term
  const filteredData = data.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, rowData: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Skip the first 6 rows and start from row 7
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
        range.s.r = 6;
        worksheet["!ref"] = XLSX.utils.encode_range(range);
        
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        
        if (excelData.length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No data found in the Excel file",
          });
          return;
        }

        // Insert the data into Supabase
        const { error } = await supabase
          .from('shipping_schedules')
          .insert(excelData[0]); // Only insert the first row

        if (error) {
          console.error("Error inserting data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload data",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Data uploaded successfully",
        });
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process Excel file",
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search in table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-lg border bg-white shadow-sm">
        <ScrollArea className="h-[600px] rounded-md border">
          <div className="relative">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  <TableHead className="sticky left-0 z-20 bg-white min-w-[100px]">
                    Actions
                  </TableHead>
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index}
                      className="min-w-[150px] bg-white py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="sticky left-0 z-10 bg-white">
                      <div className="flex items-center">
                        <input
                          type="file"
                          id={`file-upload-${rowIndex}`}
                          className="hidden"
                          accept=".xlsx,.xls"
                          onChange={(e) => handleFileUpload(e, row)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => document.getElementById(`file-upload-${rowIndex}`)?.click()}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </TableCell>
                    {headers.map((header, colIndex) => {
                      const value = row[header];
                      const isNumeric = !isNaN(value) && value !== "";
                      
                      return (
                        <TableCell 
                          key={`${rowIndex}-${colIndex}`}
                          className={`whitespace-nowrap py-4 px-4 text-sm ${
                            isNumeric ? 'text-right font-mono' : 'text-left'
                          }`}
                        >
                          {value || '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Table Info */}
      <div className="text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
};