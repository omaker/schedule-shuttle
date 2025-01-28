import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ShippingTable } from "@/components/ShippingTable";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ShippingDashboard } from "@/components/ShippingDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [shippingData, setShippingData] = useState<any[]>(() => {
    const savedData = localStorage.getItem('shippingData');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataReceived = (data: any[]) => {
    setShippingData(data);
    localStorage.setItem('shippingData', JSON.stringify(data));
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "EXCEL ID": "",
        "Year": "",
        "Month": "",
        "Fin Month": "",
        "Product": "",
        "Laycan Status": "",
        "First ETA": "",
        "Vessel": "",
        "Company": "",
        "Laycan Start": "",
        "Laycan Stop": "",
        "ETA": "",
        "Commence": "",
        "ATC": "",
        "Terminal": "",
        "L/R": "",
        "Dem Rate": "",
        "Plan Qty": "",
        "Progress": "",
        "Act Qty": "",
        "LC MIN": "",
        "LC MAX": "",
        "Remark": "",
        "Est Des/(Dem)": "",
        "LC&CSA STATUS": "",
        "Total Qty": "",
        "Laydays": "",
        "Arrival": "",
        "Laytime Start": "",
        "Laytime Stop": "",
        "Act L/R": "",
        "Loading Status": "",
        "complete": "",
        "Laycan Part": "",
        "Laycan Period": "",
        "a": "",
        "b": "",
        "Ship Code": "",
        "Sales Status": "",
        "DY": "",
        "Incoterm": "",
        "Contract Period": "",
        "Direct / AIS": "",
        "Ship Code OMDB": "",
        "c": "",
        "d": "",
        "Country": "",
        "Sector": "",
        "Base Customer": "",
        "Region": "",
        "e": "",
        "f": "",
        "Price Code": "",
        "Fixed/Index Linked": "",
        "Pricing Period": "",
        "Barge Adj": "",
        "Settled/Floating": "",
        "Price (FOB Vessel)": "",
        "Price Adj Load Port": "",
        "Price Adj Load Port and CV": "",
        "Price FOB Vessel Adj CV": "",
        "Revenue": "",
        "Revenue Adj to Loadport": "",
        "Revenue adj to load port and CV": "",
        "Revenue FOB Vessel and CV": "",
        "g": "",
        "h": "",
        "CV Typical": "",
        "CV Rejection": "",
        "CV Acceptable": "",
        "Blending Proportion": "",
        "BC IUP": "",
        "BC Tonnage": "",
        "AI Tonnage": "",
        "BC CV": "",
        "AI CV": "",
        "Expected blended CV": "",
        "CV Typical x tonnage": "",
        "CV Rejection x tonnage": "",
        "CV Acceptable x tonnage": "",
        "PIT": "",
        "Product Marketing": "",
        "i": "",
        "j": "",
        "Price code non-capped": "",
        "Price non-capped": "",
        "Price non-capped Adj LP CV Acc": "",
        "Revenue non-capped Adj LP CV Acc": "",
        "CV AR": "",
        "TM": "",
        "TS ADB": "",
        "ASH AR": "",
        "HPB Cap": "",
        "HBA 2": "",
        "HPB Market": "",
        "BLU Tarif": "",
        "Pungutan BLU": "",
        "Revenue Capped": "",
        "Revenue Non-Capped": "",
        "Incremental Revenue": "",
        "Net BLU Expense/(Income)": "",
        "k": "",
        "l": "",
        "m": "",
        "n": "",
        "o": "",
        "p": "",
        "q": "",
        "r": "",
        "s": ""
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "shipping_schedule_template.xlsx");

    toast({
      title: "Template berhasil diunduh",
      description: "Silakan isi template sesuai dengan format yang ada",
    });
  };

  const PreUploadView = () => (
    <Card className="p-8 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-mint-100 flex items-center justify-center">
        <Upload className="w-8 h-8 text-mint-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Upload Excel File</h3>
        <p className="text-muted-foreground">
          Please upload an Excel file to view and manage shipping schedules.
        </p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Schedule Manager
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Upload Excel file untuk mengelola jadwal pengiriman Anda
          </p>
          <div className="space-x-4">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="mx-auto bg-white hover:bg-gray-50"
            >
              <Download className="mr-2" />
              Download Template Excel
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <FileUpload onDataReceived={handleDataReceived} />
          
          <div className="mt-8 animate-fade-in">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <ShippingDashboard />
              </TabsContent>
              <TabsContent value="table">
                {shippingData.length === 0 ? (
                  <PreUploadView />
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      Shipping Data
                    </h2>
                    <ShippingTable data={shippingData} showCombinedData={true} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
