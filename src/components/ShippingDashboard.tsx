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
import { Loader2, Package, Ship, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ShippingDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalShipments, setTotalShipments] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-mint-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Shipments</h3>
          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-4">
              {data.slice(0, 5).map((shipment, index) => (
                <Card key={index} className="p-4 border-mint-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{shipment.product || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{shipment.company || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-mint-600">{shipment.plan_qty || 0} tons</p>
                      <p className="text-xs text-gray-500">{shipment.loading_status || 'N/A'}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};