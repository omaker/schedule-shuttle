import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Ship, Weight, Calendar, Package, Building, MapPin, DollarSign, Anchor, Clock, Info,
  BarChart, FileText, Globe, Truck, Calculator, Scale
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShippingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const { data: shipping, isLoading, isError } = useQuery({
    queryKey: ['shipping', id],
    queryFn: async () => {
      console.log('Fetching shipping details for ID:', id);
      const { data, error } = await supabase
        .from('shipping_schedules')
        .select('*')
        .eq('excel_id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching shipping details:', error);
        throw error;
      }

      if (!data) {
        console.log('No shipping data found for ID:', id);
        throw new Error('Shipping schedule not found');
      }

      console.log('Shipping data retrieved:', data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shipping details. The schedule might not exist.",
        });
      }
    }
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mint-600" />
      </div>
    );
  }

  if (isError || !shipping) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="mb-6 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h1 className="text-2xl font-semibold mb-4 text-mint-800">
              Shipping Schedule Not Found
            </h1>
            <p className="text-gray-600">
              The shipping schedule you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="mb-6 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2 text-mint-800">
              Detail Pengiriman #{shipping?.excel_id}
            </h1>
            <Badge className={`${getStatusColor(shipping?.loading_status || '')} flex items-center gap-1.5 w-fit`}>
              <Ship className="w-3 h-3" />
              {shipping?.loading_status || 'Pending'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Dasar</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Produk:</p>
                <div className="flex items-center gap-1.5">
                  <Package className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.product || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Berat:</p>
                <div className="flex items-center gap-1.5">
                  <Weight className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.plan_qty || 0} ton</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Status:</p>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.loading_status || "Pending"}</p>
                </div>
              </div>
            </div>

            {/* Informasi Pengiriman */}
            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Pengiriman</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Perusahaan:</p>
                <div className="flex items-start gap-1.5">
                  <Building className="w-3 h-3 text-mint-600 mt-0.5" />
                  <div>
                    <p>{shipping?.company || "Tidak ada data"}</p>
                    <p className="text-gray-600">{shipping?.terminal || "Tidak ada data"}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Negara:</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.country || "Tidak ada data"}</p>
                </div>
              </div>
            </div>

            {/* Detail Tambahan */}
            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Detail Tambahan</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tahun:</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.year || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Bulan:</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.month || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Fin Month:</p>
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.fin_month || "Tidak ada data"}</p>
                </div>
              </div>
            </div>

            {/* Informasi Kapal */}
            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Kapal</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Vessel:</p>
                <div className="flex items-center gap-1.5">
                  <Anchor className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.vessel || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Ship Code:</p>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.ship_code || "Tidak ada data"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t text-sm">
            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Region</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Region:</p>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.region || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Terminal:</p>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.terminal || "Tidak ada data"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Kontrak</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Contract Period:</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.contract_period || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Price Code:</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.price_code || "Tidak ada data"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi Harga</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Price FOB:</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.price_fob_vessel || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Revenue:</p>
                <div className="flex items-center gap-1.5">
                  <BarChart className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.revenue || "Tidak ada data"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-medium text-mint-700 border-b pb-1">Informasi CV</h2>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">CV Typical:</p>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.cv_typical || "Tidak ada data"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">CV Acceptable:</p>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-mint-600" />
                  <p>{shipping?.cv_acceptable || "Tidak ada data"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetail;