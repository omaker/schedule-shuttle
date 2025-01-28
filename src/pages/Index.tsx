import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ShippingTable } from "@/components/ShippingTable";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import ShippingDashboard from "@/components/ShippingDashboard";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [shippingData, setShippingData] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'table'>('dashboard');
  
  const handleDataReceived = (data: any[]) => {
    setShippingData(data);
    setCurrentView('table');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => setCurrentView('upload')}
                className="bg-mint-600 hover:bg-mint-700 text-white px-6 py-3 text-lg shadow-lg transition-all hover:shadow-xl"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Excel File
              </Button>
            </div>
            <ShippingDashboard />
          </div>
        );
      
      case 'upload':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload Excel File
              </h2>
              <FileUpload onDataReceived={handleDataReceived} />
            </Card>
            <div className="flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                className="text-mint-600 border-mint-600 hover:bg-mint-50"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Shipping Data
              </h2>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setCurrentView('upload')}
                  className="bg-mint-600 hover:bg-mint-700 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New File
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-mint-600 border-mint-600 hover:bg-mint-50"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <ShippingTable data={shippingData} showCombinedData={true} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Schedule Manager
          </h1>
          <p className="text-lg text-gray-600">
            {currentView === 'dashboard' && "View and manage your shipping schedules"}
            {currentView === 'upload' && "Upload a new Excel file to add shipping schedules"}
            {currentView === 'table' && "Review your uploaded shipping data"}
          </p>
        </div>

        <div className="space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;