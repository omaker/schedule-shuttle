import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Ship, Package, Building, MapPin, Calendar, 
  Weight, DollarSign, Percent, ArrowLeft 
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
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Product Details:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3 h-3 text-mint-600" />
                    <p>{shipping?.product || "Tidak ada data"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Tanggal:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-mint-600" />
                    <p>{formatShippingDate(shipping?.month)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Financial Month:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-mint-600" />
                    <p>{formatFinMonth(shipping?.fin_month)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Weight:</p>
                  <div className="flex items-center gap-1.5">
                    <Weight className="w-3 h-3 text-mint-600" />
                    <p>{shipping?.plan_qty || 0} ton</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Company:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-mint-600" />
                    <p>{shipping?.company || "Tidak ada data"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Terminal:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-mint-600" />
                    <p>{shipping?.terminal || "Tidak ada data"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Country:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-mint-600" />
                    <p>{shipping?.country || "Tidak ada data"}</p>
                  </div>
                </div>

                {shipping?.price_fob_vessel && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Price (FOB Vessel):
                    </p>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-mint-600" />
                      <p>{shipping.price_fob_vessel}</p>
                    </div>
                  </div>
                )}

                {shipping?.cv_acceptable && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      CV Acceptable:
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3 h-3 text-mint-600" />
                      <p>{shipping.cv_acceptable}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingDetail;