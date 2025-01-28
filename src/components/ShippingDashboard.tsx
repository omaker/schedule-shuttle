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
import { Loader2, Package, Ship, Calendar, Search, Eye, Trash2, Info, DollarSign, Calculator, Activity, Scale, FileText, MapPin, Clock, Building, Truck, Weight } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatShippingDate, formatFinMonth } from "@/utils/dateFormatters";

export const ShippingDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalShipments, setTotalShipments] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const COLORS = ['#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

  useEffect(() => {
    fetchData();
  }, []);

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch shipping data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedShipment) return;

    try {
      const { error } = await supabase
        .from('shipping_schedules')
        .delete()
        .eq('excel_id', selectedShipment.excel_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipment deleted successfully",
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete shipment",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedShipment(null);
    }
  };

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

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    
    switch (status.toLowerCase()) {
      case "complete":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in progress":
      case "otw":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
      case "not ok":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "ok":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "unsold":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
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
                  <TableHead>Excel ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Weight (tons)</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((shipment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{shipment.excel_id || 'N/A'}</TableCell>
                    <TableCell>{shipment.product || 'N/A'}</TableCell>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipping Details #{selectedShipment?.excel_id}</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedShipment?.loading_status
                      )}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Ship className="w-3 h-3" />
                        {selectedShipment?.loading_status || "No Status"}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedShipment?.sales_status
                      )}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3" />
                        {selectedShipment?.sales_status || "No Sales Status"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Basic Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={Package} label="Product" value={selectedShipment?.product} />
                      <InfoItem icon={Package} label="Product Marketing" value={selectedShipment?.product_marketing} />
                      <InfoItem icon={Calendar} label="Year" value={selectedShipment?.year} />
                      <InfoItem icon={Calendar} label="Month" value={formatShippingDate(selectedShipment?.month)} />
                      <InfoItem icon={Calendar} label="Financial Month" value={formatFinMonth(selectedShipment?.fin_month)} />
                      <InfoItem icon={Ship} label="Vessel" value={selectedShipment?.vessel} />
                      <InfoItem icon={Building} label="Company" value={selectedShipment?.company} />
                      <InfoItem icon={Info} label="Ship Code" value={selectedShipment?.ship_code} />
                      <InfoItem icon={Info} label="Ship Code OMDB" value={selectedShipment?.ship_code_omdb} />
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping Details
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={MapPin} label="Terminal" value={selectedShipment?.terminal} />
                      <InfoItem icon={MapPin} label="Country" value={selectedShipment?.country} />
                      <InfoItem icon={MapPin} label="Region" value={selectedShipment?.region} />
                      <InfoItem icon={MapPin} label="Pit" value={selectedShipment?.pit} />
                      <InfoItem icon={Weight} label="Plan Quantity" value={`${selectedShipment?.plan_qty || 0} MT`} />
                      <InfoItem icon={Weight} label="Total Quantity" value={`${selectedShipment?.total_qty || 0} MT`} />
                      <InfoItem icon={Clock} label="Laydays" value={selectedShipment?.laydays} />
                      <InfoItem icon={Clock} label="Laycan Start" value={selectedShipment?.laycan_start} />
                      <InfoItem icon={Clock} label="Laycan Stop" value={selectedShipment?.laycan_stop} />
                      <InfoItem icon={Clock} label="Laycan Period" value={selectedShipment?.laycan_period} />
                      <InfoItem icon={Clock} label="Laycan Part" value={selectedShipment?.laycan_part} />
                      <InfoItem icon={Clock} label="ETA" value={selectedShipment?.eta} />
                      <InfoItem icon={Clock} label="Arrival" value={selectedShipment?.arrival} />
                      <InfoItem icon={Info} label="Direct AIS" value={selectedShipment?.direct_ais} />
                      <InfoItem icon={Info} label="LCSA Status" value={selectedShipment?.lcsa_status} />
                      <InfoItem icon={Info} label="Complete" value={selectedShipment?.complete} />
                    </div>
                  </div>

                  {/* Commercial Details */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Commercial Details
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={Info} label="Incoterm" value={selectedShipment?.incoterm} />
                      <InfoItem icon={Info} label="Contract Period" value={selectedShipment?.contract_period} />
                      <InfoItem icon={Info} label="Price Code" value={selectedShipment?.price_code} />
                      <InfoItem icon={Info} label="Price Code Non Capped" value={selectedShipment?.price_code_non_capped} />
                      <InfoItem icon={Info} label="Fixed/Index Linked" value={selectedShipment?.fixed_index_linked} />
                      <InfoItem icon={Info} label="Pricing Period" value={selectedShipment?.pricing_period} />
                      <InfoItem icon={Info} label="Settled/Floating" value={selectedShipment?.settled_floating} />
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price Information
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={Calculator} label="Price FOB Vessel" value={selectedShipment?.price_fob_vessel} />
                      <InfoItem icon={Calculator} label="Price Adj Load Port" value={selectedShipment?.price_adj_load_port} />
                      <InfoItem icon={Calculator} label="Price Adj Load Port CV" value={selectedShipment?.price_adj_load_port_cv} />
                      <InfoItem icon={Calculator} label="Price FOB Vessel Adj CV" value={selectedShipment?.price_fob_vessel_adj_cv} />
                      <InfoItem icon={Calculator} label="Price Non Capped" value={selectedShipment?.price_non_capped} />
                      <InfoItem icon={Calculator} label="Price Non Capped Adj LP CV Acc" value={selectedShipment?.price_non_capped_adj_lp_cv_acc} />
                    </div>
                  </div>

                  {/* Revenue Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BarChart className="w-4 h-4" />
                      Revenue Information
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={DollarSign} label="Revenue" value={selectedShipment?.revenue} />
                      <InfoItem icon={DollarSign} label="Revenue Adj Loadport" value={selectedShipment?.revenue_adj_loadport} />
                      <InfoItem icon={DollarSign} label="Revenue Adj Load Port CV" value={selectedShipment?.revenue_adj_load_port_cv} />
                      <InfoItem icon={DollarSign} label="Revenue FOB Vessel CV" value={selectedShipment?.revenue_fob_vessel_cv} />
                      <InfoItem icon={DollarSign} label="Revenue Capped" value={selectedShipment?.revenue_capped} />
                      <InfoItem icon={DollarSign} label="Revenue Non Capped" value={selectedShipment?.revenue_non_capped} />
                      <InfoItem icon={DollarSign} label="Revenue Non Capped Adj LP CV Acc" value={selectedShipment?.revenue_non_capped_adj_lp_cv_acc} />
                      <InfoItem icon={DollarSign} label="Incremental Revenue" value={selectedShipment?.incremental_revenue} />
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Technical Details
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={Scale} label="CV Typical" value={selectedShipment?.cv_typical} />
                      <InfoItem icon={Scale} label="CV Acceptable" value={selectedShipment?.cv_acceptable} />
                      <InfoItem icon={Scale} label="CV AR" value={selectedShipment?.cv_ar} />
                      <InfoItem icon={Scale} label="TM" value={selectedShipment?.tm} />
                      <InfoItem icon={Scale} label="TS ADB" value={selectedShipment?.ts_adb} />
                      <InfoItem icon={Scale} label="Ash AR" value={selectedShipment?.ash_ar} />
                      <InfoItem icon={Info} label="BC IUP" value={selectedShipment?.bc_iup} />
                      <InfoItem icon={Weight} label="BC Tonnage" value={selectedShipment?.bc_tonnage} />
                      <InfoItem icon={Weight} label="AI Tonnage" value={selectedShipment?.ai_tonnage} />
                      <InfoItem icon={Scale} label="BC CV" value={selectedShipment?.bc_cv} />
                      <InfoItem icon={Scale} label="AI CV" value={selectedShipment?.ai_cv} />
                      <InfoItem icon={Scale} label="Expected Blended CV" value={selectedShipment?.expected_blended_cv} />
                      <InfoItem icon={Weight} label="CV Typical Tonnage" value={selectedShipment?.cv_typical_tonnage} />
                      <InfoItem icon={Weight} label="CV Rejection Tonnage" value={selectedShipment?.cv_rejection_tonnage} />
                      <InfoItem icon={Weight} label="CV Acceptable Tonnage" value={selectedShipment?.cv_acceptable_tonnage} />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <InfoItem icon={Calculator} label="HPB Cap" value={selectedShipment?.hpb_cap} />
                      <InfoItem icon={Calculator} label="HBA 2" value={selectedShipment?.hba_2} />
                      <InfoItem icon={Calculator} label="HPB Market" value={selectedShipment?.hpb_market} />
                      <InfoItem icon={Calculator} label="BLU Tarif" value={selectedShipment?.blu_tarif} />
                      <InfoItem icon={Calculator} label="Pungutan BLU" value={selectedShipment?.pungutan_blu} />
                      <InfoItem icon={Calculator} label="Net BLU Expense Income" value={selectedShipment?.net_blu_expense_income} />
                      <InfoItem icon={Calendar} label="Created At" value={selectedShipment?.created_at} />
                      <InfoItem icon={Calendar} label="Updated At" value={selectedShipment?.updated_at} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shipment
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const InfoItem = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: any;
  label: string;
  value: string | number | null;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}:</p>
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-mint-600" />
      <p>{value ?? "Tidak ada data"}</p>
    </div>
  </div>
);

export default ShippingDashboard;