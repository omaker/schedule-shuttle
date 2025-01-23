import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ShippingTable } from "@/components/ShippingTable";

const Index = () => {
  const [shippingData, setShippingData] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Schedule Manager
          </h1>
          <p className="text-lg text-gray-600">
            Upload Excel file untuk mengelola jadwal pengiriman Anda
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onDataReceived={setShippingData} />
          
          {shippingData.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Shipping Schedule
              </h2>
              <ShippingTable data={shippingData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;