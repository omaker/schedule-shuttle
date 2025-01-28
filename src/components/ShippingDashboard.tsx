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
import { Loader2 } from "lucide-react";

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
          .select('*');

        if (error) throw error;

        console.log('Fetched shipping data:', shipments);
        setData(shipments || []);

        // Calculate total shipments
        setTotalShipments(shipments?.length || 0);

        // Calculate total weight
        const total = shipments?.reduce((acc, curr) => acc + (Number(curr.plan_qty) || 0), 0);
        setTotalWeight(Math.round(total));

        // Calculate status distribution
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-gray-900">Shipping Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Shipments</h3>
          <p className="text-3xl font-bold text-mint-500">{totalShipments}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Weight</h3>
          <p className="text-3xl font-bold text-mint-500">{totalWeight.toLocaleString()} tons</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Weight</h3>
          <p className="text-3xl font-bold text-mint-500">
            {totalShipments ? Math.round(totalWeight / totalShipments).toLocaleString() : 0} tons
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
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
          <h3 className="text-lg font-semibold mb-4">Weight by Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="loading_status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plan_qty" fill="#2a9d8f" name="Weight (tons)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};