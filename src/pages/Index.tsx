import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ShippingTable } from "@/components/ShippingTable";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard, Table, Upload, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ShippingDashboard } from "@/components/ShippingDashboard";
import { Card } from "@/components/ui/card";
import { Steps } from "@/components/Steps";

const Index = () => {
  const [shippingData, setShippingData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataReceived = (data: any[]) => {
    setShippingData(data);
    setCurrentStep(1); // Move to table view after upload
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

  const steps = [
    {
      title: "Upload Data",
      icon: <Upload className="w-6 h-6" />,
      content: (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              <Download className="mr-2" />
              Download Template Excel
            </Button>
          </div>
          <FileUpload onDataReceived={handleDataReceived} />
        </div>
      ),
    },
    {
      title: "View Table",
      icon: <Table className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          {shippingData.length > 0 ? (
            <ShippingTable data={shippingData} showCombinedData={true} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Please upload an Excel file to view data
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
      content: <ShippingDashboard />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-mint-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Schedule Manager
          </h1>
          <p className="text-lg text-gray-600">
            Manage your shipping schedules efficiently
          </p>
        </div>

        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 animate-fade-in">
          {steps[currentStep].content}
        </div>

        {currentStep < steps.length - 1 && shippingData.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-mint-500 hover:bg-mint-600"
            >
              Next Step
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
