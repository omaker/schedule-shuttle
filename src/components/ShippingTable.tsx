import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShippingTableProps {
  data: any[];
}

export const ShippingTable = ({ data }: ShippingTableProps) => {
  const headers = [
    "EXCEL ID", "Year", "Month", "Fin Month", "Product", "Laycan Status", "First ETA", "Vessel", "Company",
    "Laycan Start", "Laycan Stop", "ETA", "Commence", "ATC", "Terminal", "L/R", "Dem Rate", "Plan Qty",
    "Progress", "Act Qty", "LC MIN", "LC MAX", "Remark", "Est Des/(Dem)", "LC&CSA STATUS", "Total Qty",
    "Laydays", "Arrival", "Laytime Start", "Laytime Stop", "Act L/R", "Loading Status", "complete",
    "Laycan Part", "Laycan Period", "a", "b", "Ship Code", "Sales Status", "DY", "Incoterm",
    "Contract Period", "Direct / AIS", "Ship Code OMDB", "c", "d", "Country", "Sector", "Base Customer",
    "Region", "e", "f", "Price Code", "Fixed/Index Linked", "Pricing Period", "Barge Adj",
    "Settled/Floating", "Price (FOB Vessel)", "Price Adj Load Port", "Price Adj Load Port and CV",
    "Price FOB Vessel Adj CV", "Revenue", "Revenue Adj to Loadport", "Revenue adj to load port and CV",
    "Revenue FOB Vessel and CV", "g", "h", "CV Typical", "CV Rejection", "CV Acceptable",
    "Blending Proportion", "BC IUP", "BC Tonnage", "AI Tonnage", "BC CV", "AI CV", "Expected blended CV",
    "CV Typical x tonnage", "CV Rejection x tonnage", "CV Acceptable x tonnage", "PIT",
    "Product Marketing", "i", "j", "Price code non-capped", "Price non-capped",
    "Price non-capped Adj LP CV Acc", "Revenue non-capped Adj LP CV Acc", "CV AR", "TM", "TS ADB",
    "ASH AR", "HPB Cap", "HBA 2", "HPB Market", "BLU Tarif", "Pungutan BLU", "Revenue Capped",
    "Revenue Non-Capped", "Incremental Revenue", "Net BLU Expense/(Income)", "k", "l", "m", "n",
    "o", "p", "q", "r", "s"
  ];

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead 
                  key={index}
                  className="min-w-[150px] whitespace-nowrap py-4 font-semibold text-gray-900"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell 
                    key={`${rowIndex}-${colIndex}`}
                    className="whitespace-nowrap py-4"
                  >
                    {row[header] || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};