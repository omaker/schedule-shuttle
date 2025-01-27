import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
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