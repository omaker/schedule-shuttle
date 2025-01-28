import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Ship, Package, Building, MapPin, Calendar, 
  Weight, DollarSign, Percent, ArrowLeft,
  Info, Truck, Clock, FileText, BarChart,
  Calculator, Activity, Scale
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
      <div className="max-w-7xl mx-auto">
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
                <div className="flex gap-2">
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
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      shipping?.sales_status
                    )}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" />
                      {shipping?.sales_status || "No Sales Status"}
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
                    <InfoItem icon={Package} label="Product" value={shipping?.product} />
                    <InfoItem icon={Package} label="Product Marketing" value={shipping?.product_marketing} />
                    <InfoItem icon={Calendar} label="Year" value={shipping?.year} />
                    <InfoItem icon={Calendar} label="Month" value={formatShippingDate(shipping?.month)} />
                    <InfoItem icon={Calendar} label="Financial Month" value={formatFinMonth(shipping?.fin_month)} />
                    <InfoItem icon={Ship} label="Vessel" value={shipping?.vessel} />
                    <InfoItem icon={Building} label="Company" value={shipping?.company} />
                    <InfoItem icon={Info} label="Ship Code" value={shipping?.ship_code} />
                    <InfoItem icon={Info} label="Ship Code OMDB" value={shipping?.ship_code_omdb} />
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
                    <InfoItem icon={MapPin} label="Pit" value={shipping?.pit} />
                    <InfoItem icon={Weight} label="Plan Quantity" value={`${shipping?.plan_qty || 0} MT`} />
                    <InfoItem icon={Weight} label="Total Quantity" value={`${shipping?.total_qty || 0} MT`} />
                    <InfoItem icon={Clock} label="Laydays" value={shipping?.laydays} />
                    <InfoItem icon={Clock} label="Laycan Start" value={shipping?.laycan_start} />
                    <InfoItem icon={Clock} label="Laycan Stop" value={shipping?.laycan_stop} />
                    <InfoItem icon={Clock} label="Laycan Period" value={shipping?.laycan_period} />
                    <InfoItem icon={Clock} label="Laycan Part" value={shipping?.laycan_part} />
                    <InfoItem icon={Clock} label="ETA" value={shipping?.eta} />
                    <InfoItem icon={Clock} label="Arrival" value={shipping?.arrival} />
                    <InfoItem icon={Info} label="Direct AIS" value={shipping?.direct_ais} />
                    <InfoItem icon={Info} label="LCSA Status" value={shipping?.lcsa_status} />
                    <InfoItem icon={Info} label="Complete" value={shipping?.complete} />
                  </div>
                </div>

                {/* Commercial Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Commercial Details
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={Info} label="Incoterm" value={shipping?.incoterm} />
                    <InfoItem icon={Info} label="Contract Period" value={shipping?.contract_period} />
                    <InfoItem icon={Info} label="Price Code" value={shipping?.price_code} />
                    <InfoItem icon={Info} label="Price Code Non Capped" value={shipping?.price_code_non_capped} />
                    <InfoItem icon={Info} label="Fixed/Index Linked" value={shipping?.fixed_index_linked} />
                    <InfoItem icon={Info} label="Pricing Period" value={shipping?.pricing_period} />
                    <InfoItem icon={Info} label="Settled/Floating" value={shipping?.settled_floating} />
                  </div>
                </div>

                {/* Price Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Information
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={Calculator} label="Price FOB Vessel" value={shipping?.price_fob_vessel} />
                    <InfoItem icon={Calculator} label="Price Adj Load Port" value={shipping?.price_adj_load_port} />
                    <InfoItem icon={Calculator} label="Price Adj Load Port CV" value={shipping?.price_adj_load_port_cv} />
                    <InfoItem icon={Calculator} label="Price FOB Vessel Adj CV" value={shipping?.price_fob_vessel_adj_cv} />
                    <InfoItem icon={Calculator} label="Price Non Capped" value={shipping?.price_non_capped} />
                    <InfoItem icon={Calculator} label="Price Non Capped Adj LP CV Acc" value={shipping?.price_non_capped_adj_lp_cv_acc} />
                  </div>
                </div>

                {/* Revenue Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    Revenue Information
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={DollarSign} label="Revenue" value={shipping?.revenue} />
                    <InfoItem icon={DollarSign} label="Revenue Adj Loadport" value={shipping?.revenue_adj_loadport} />
                    <InfoItem icon={DollarSign} label="Revenue Adj Load Port CV" value={shipping?.revenue_adj_load_port_cv} />
                    <InfoItem icon={DollarSign} label="Revenue FOB Vessel CV" value={shipping?.revenue_fob_vessel_cv} />
                    <InfoItem icon={DollarSign} label="Revenue Capped" value={shipping?.revenue_capped} />
                    <InfoItem icon={DollarSign} label="Revenue Non Capped" value={shipping?.revenue_non_capped} />
                    <InfoItem icon={DollarSign} label="Revenue Non Capped Adj LP CV Acc" value={shipping?.revenue_non_capped_adj_lp_cv_acc} />
                    <InfoItem icon={DollarSign} label="Incremental Revenue" value={shipping?.incremental_revenue} />
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Technical Details
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={Scale} label="CV Typical" value={shipping?.cv_typical} />
                    <InfoItem icon={Scale} label="CV Acceptable" value={shipping?.cv_acceptable} />
                    <InfoItem icon={Scale} label="CV AR" value={shipping?.cv_ar} />
                    <InfoItem icon={Scale} label="TM" value={shipping?.tm} />
                    <InfoItem icon={Scale} label="TS ADB" value={shipping?.ts_adb} />
                    <InfoItem icon={Scale} label="Ash AR" value={shipping?.ash_ar} />
                    <InfoItem icon={Info} label="BC IUP" value={shipping?.bc_iup} />
                    <InfoItem icon={Weight} label="BC Tonnage" value={shipping?.bc_tonnage} />
                    <InfoItem icon={Weight} label="AI Tonnage" value={shipping?.ai_tonnage} />
                    <InfoItem icon={Scale} label="BC CV" value={shipping?.bc_cv} />
                    <InfoItem icon={Scale} label="AI CV" value={shipping?.ai_cv} />
                    <InfoItem icon={Scale} label="Expected Blended CV" value={shipping?.expected_blended_cv} />
                    <InfoItem icon={Weight} label="CV Typical Tonnage" value={shipping?.cv_typical_tonnage} />
                    <InfoItem icon={Weight} label="CV Rejection Tonnage" value={shipping?.cv_rejection_tonnage} />
                    <InfoItem icon={Weight} label="CV Acceptable Tonnage" value={shipping?.cv_acceptable_tonnage} />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={Calculator} label="HPB Cap" value={shipping?.hpb_cap} />
                    <InfoItem icon={Calculator} label="HBA 2" value={shipping?.hba_2} />
                    <InfoItem icon={Calculator} label="HPB Market" value={shipping?.hpb_market} />
                    <InfoItem icon={Calculator} label="BLU Tarif" value={shipping?.blu_tarif} />
                    <InfoItem icon={Calculator} label="Pungutan BLU" value={shipping?.pungutan_blu} />
                    <InfoItem icon={Calculator} label="Net BLU Expense Income" value={shipping?.net_blu_expense_income} />
                    <InfoItem icon={Calendar} label="Created At" value={shipping?.created_at} />
                    <InfoItem icon={Calendar} label="Updated At" value={shipping?.updated_at} />
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
      <p>{value ?? "Tidak ada data"}</p>
    </div>
  </div>
);

export default ShippingDetail;