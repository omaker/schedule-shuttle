import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, Package, Ship, Calendar, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

export const ShippingDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalShipments, setTotalShipments] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const COLORS = ['#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching shipping data...');
        const { data: shipments, error } = await supabase
          .from('shipping_schedules')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched shipping data:', shipments);
        setData(shipments || []);
        setTotalShipments(shipments?.length || 0);

        const total = shipments?.reduce((acc, curr) => acc + (Number(curr.plan_qty) || 0), 0);
        setTotalWeight(Math.round(total));

        const statusCount = shipments?.reduce((acc: any, curr) => {
          const status = curr.loading_status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const statusData = Object.entries(statusCount).map(([name, value]) => ({
          name,
          value,
        }));

        setStatusDistribution(statusData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-mint-100 hover:border-mint-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-mint-100 rounded-lg">
              <Ship className="h-6 w-6 text-mint-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Shipments</h3>
              <p className="text-2xl font-bold text-mint-600">{totalShipments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-mint-100 hover:border-mint-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-mint-100 rounded-lg">
              <Package className="h-6 w-6 text-mint-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Weight</h3>
              <p className="text-2xl font-bold text-mint-600">{totalWeight.toLocaleString()} tons</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-mint-100 hover:border-mint-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-mint-100 rounded-lg">
              <Calendar className="h-6 w-6 text-mint-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Average Weight</h3>
              <p className="text-2xl font-bold text-mint-600">
                {totalShipments ? Math.round(totalWeight / totalShipments).toLocaleString() : 0} tons
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Shipment Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plan_qty" fill="#2a9d8f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Complete Shipment Data</h3>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Weight (tons)</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((shipment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{shipment.product || 'N/A'}</TableCell>
                    <TableCell>{shipment.company || 'N/A'}</TableCell>
                    <TableCell>{shipment.terminal || 'N/A'}</TableCell>
                    <TableCell>{shipment.plan_qty?.toLocaleString() || '0'}</TableCell>
                    <TableCell>{shipment.country || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${shipment.loading_status?.toLowerCase() === 'complete' 
                          ? 'bg-green-100 text-green-800'
                          : shipment.loading_status?.toLowerCase() === 'in progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {shipment.loading_status || 'N/A'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </div>
  );
};