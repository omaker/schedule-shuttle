import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ShippingRowProps {
  row: any;
  headers: string[];
}

export const ShippingRow = ({ row, headers }: ShippingRowProps) => {
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

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      {headers.map((header, colIndex) => {
        const value = row[header];
        const isStatusColumn = [
          'Laycan Status',
          'LC&CSA STATUS',
          'Loading Status',
          'Sales Status'
        ].includes(header);
        
        return (
          <TableCell 
            key={`${row["EXCEL ID"]}-${colIndex}`}
            className={`whitespace-nowrap py-4 px-4 text-sm ${
              !isStatusColumn && !isNaN(value) && value !== "" ? 'text-right font-mono' : 'text-left'
            }`}
          >
            {isStatusColumn ? renderStatusCell(value) : (value || '-')}
          </TableCell>
        );
      })}
    </TableRow>
  );
};