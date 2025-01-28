import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Ship, Package, Building, MapPin, Calendar, 
  Weight, DollarSign, Percent, ArrowLeft,
  Info, Truck, Clock, FileText
} from "lucide-react";
import { formatShippingDate, formatFinMonth } from "@/utils/dateFormatters";

const ShippingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: shipping, isLoading, isError } = useQuery({
    queryKey: ["shipping", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_schedules")
        .select()
        .eq("excel_id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

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

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading shipping details
          </h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[calc(100vh-200px)] w-full" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Shipping Details #{shipping?.excel_id}
                </h1>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    shipping?.loading_status
                  )}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-3 h-3" />
                    {shipping?.loading_status || "No Status"}
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
                    <InfoItem icon={Package} label="Product" value={shipping?.product} />
                    <InfoItem icon={Calendar} label="Year" value={shipping?.year} />
                    <InfoItem icon={Calendar} label="Month" value={formatShippingDate(shipping?.month)} />
                    <InfoItem icon={Calendar} label="Financial Month" value={formatFinMonth(shipping?.fin_month)} />
                    <InfoItem icon={Ship} label="Vessel" value={shipping?.vessel} />
                    <InfoItem icon={Building} label="Company" value={shipping?.company} />
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Details
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={MapPin} label="Terminal" value={shipping?.terminal} />
                    <InfoItem icon={MapPin} label="Country" value={shipping?.country} />
                    <InfoItem icon={MapPin} label="Region" value={shipping?.region} />
                    <InfoItem icon={Weight} label="Plan Quantity" value={`${shipping?.plan_qty || 0} MT`} />
                    <InfoItem icon={Weight} label="Total Quantity" value={`${shipping?.total_qty || 0} MT`} />
                    <InfoItem icon={Clock} label="Laydays" value={shipping?.laydays} />
                  </div>
                </div>

                {/* Commercial Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Commercial Details
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={DollarSign} label="Price FOB Vessel" value={shipping?.price_fob_vessel} />
                    <InfoItem icon={DollarSign} label="Revenue" value={shipping?.revenue} />
                    <InfoItem icon={Percent} label="CV Typical" value={shipping?.cv_typical} />
                    <InfoItem icon={Percent} label="CV Acceptable" value={shipping?.cv_acceptable} />
                    <InfoItem icon={Info} label="Contract Period" value={shipping?.contract_period} />
                    <InfoItem icon={Info} label="Price Code" value={shipping?.price_code} />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
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
      <p>{value || "Tidak ada data"}</p>
    </div>
  </div>
);

export default ShippingDetail;