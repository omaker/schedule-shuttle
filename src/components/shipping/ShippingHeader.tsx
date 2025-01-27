import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ShippingHeaderProps {
  headers: string[];
}

export const ShippingHeader = ({ headers }: ShippingHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
      <TableRow>
        {headers.map((header, index) => (
          <TableHead
            key={index}
            className="min-w-[150px] bg-white h-12 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            {header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};