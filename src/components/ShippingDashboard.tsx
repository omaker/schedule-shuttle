import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Building, Truck, Weight, Ship, Calendar, MapPin, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Icon className="h-4 w-4 text-mint-500" />
    <span className="text-sm text-muted-foreground">{label}:</span>
    <span className="text-sm font-medium">{value || 'N/A'}</span>
  </div>
);

const ShippingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const { toast } = useToast();

  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipping_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch shipping schedules",
        });
        throw error;
      }

      return data || [];
    },
  });

  const filteredData = shipments?.filter(shipment =>
    Object.values(shipment).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-mint-50 text-mint-700 border-mint-200';
      case 'in progress':
      case 'otw':
        return 'bg-mint-50 text-mint-700 border-mint-200';
      case 'pending':
      case 'not ok':
        return 'bg-mint-50 text-mint-700 border-mint-200';
      case 'ok':
        return 'bg-mint-50 text-mint-700 border-mint-200';
      case 'unsold':
        return 'bg-mint-50 text-mint-700 border-mint-200';
      default:
        return 'bg-mint-50 text-mint-700 border-mint-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading shipping schedules
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-mint-50/30 shadow-sm border-mint-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mint-400 h-4 w-4" />
            <Input
              placeholder="Search shipping schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-mint-200 focus:border-mint-400 focus:ring-mint-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="border-mint-200 hover:bg-mint-50 text-mint-700"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-mint-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="border-mint-200 hover:bg-mint-50 text-mint-700"
            >
              Next
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-mint-100 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-mint-50/50">
                <TableHead className="text-mint-700">Excel ID</TableHead>
                <TableHead className="text-mint-700">Product</TableHead>
                <TableHead className="text-mint-700">Company</TableHead>
                <TableHead className="text-mint-700">Terminal</TableHead>
                <TableHead className="text-mint-700">Plan Qty</TableHead>
                <TableHead className="text-mint-700">Status</TableHead>
                <TableHead className="text-mint-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((shipment, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-mint-50/30 transition-colors"
                >
                  <TableCell className="font-medium text-mint-900">{shipment.excel_id || 'N/A'}</TableCell>
                  <TableCell className="text-mint-700">{shipment.product || 'N/A'}</TableCell>
                  <TableCell className="text-mint-700">{shipment.company || 'N/A'}</TableCell>
                  <TableCell className="text-mint-700">{shipment.terminal || 'N/A'}</TableCell>
                  <TableCell className="text-mint-700">{shipment.plan_qty?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(shipment.loading_status)}`}>
                      {shipment.loading_status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-mint-200 hover:bg-mint-50 text-mint-700"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-semibold text-mint-900 mb-6">
                            Shipping Details
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[80vh] px-1">
                          <div className="space-y-8">
                            {/* Basic Info Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-mint-800 border-b pb-2">
                                Basic Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                  icon={Package}
                                  label="Excel ID"
                                  value={selectedShipment?.excel_id}
                                />
                                <InfoItem
                                  icon={Building}
                                  label="Company"
                                  value={selectedShipment?.company}
                                />
                                <InfoItem
                                  icon={Truck}
                                  label="Terminal"
                                  value={selectedShipment?.terminal}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="Plan Quantity"
                                  value={selectedShipment?.plan_qty?.toLocaleString()}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="Total Quantity"
                                  value={selectedShipment?.total_qty?.toLocaleString()}
                                />
                              </div>
                            </div>

                            {/* Shipping Details Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-mint-800 border-b pb-2">
                                Shipping Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                  icon={Ship}
                                  label="Vessel"
                                  value={selectedShipment?.vessel}
                                />
                                <InfoItem
                                  icon={Calendar}
                                  label="Laycan Start"
                                  value={selectedShipment?.laycan_start}
                                />
                                <InfoItem
                                  icon={Calendar}
                                  label="Laycan Stop"
                                  value={selectedShipment?.laycan_stop}
                                />
                                <InfoItem
                                  icon={MapPin}
                                  label="Country"
                                  value={selectedShipment?.country}
                                />
                                <InfoItem
                                  icon={MapPin}
                                  label="Region"
                                  value={selectedShipment?.region}
                                />
                              </div>
                            </div>

                            {/* Commercial Details Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-mint-800 border-b pb-2">
                                Commercial Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                  icon={DollarSign}
                                  label="Price Code"
                                  value={selectedShipment?.price_code}
                                />
                                <InfoItem
                                  icon={DollarSign}
                                  label="Fixed/Index Linked"
                                  value={selectedShipment?.fixed_index_linked}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="CV Typical"
                                  value={selectedShipment?.cv_typical}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="CV Acceptable"
                                  value={selectedShipment?.cv_acceptable}
                                />
                              </div>
                            </div>

                            {/* Additional Details Section */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-mint-800 border-b pb-2">
                                Additional Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                  icon={Weight}
                                  label="BC Tonnage"
                                  value={selectedShipment?.bc_tonnage?.toLocaleString()}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="AI Tonnage"
                                  value={selectedShipment?.ai_tonnage?.toLocaleString()}
                                />
                                <InfoItem
                                  icon={Weight}
                                  label="Expected Blended CV"
                                  value={selectedShipment?.expected_blended_cv}
                                />
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ShippingDashboard;