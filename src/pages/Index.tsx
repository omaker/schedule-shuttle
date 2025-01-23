import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ShippingTable } from "@/components/ShippingTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [shippingData, setShippingData] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        "No": "",
        "Tanggal Pengiriman": "",
        "Nama Pengirim": "",
        "Alamat Pengirim": "",
        "Nama Penerima": "",
        "Alamat Penerima": "",
        "Jenis Barang": "",
        "Berat (kg)": "",
        "Status": ""
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Save file
    XLSX.writeFile(wb, "shipping_schedule_template.xlsx");

    toast({
      title: "Template berhasil diunduh",
      description: "Silakan isi template sesuai dengan format yang ada",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
              className="mx-auto"
            >
              <Download className="mr-2" />
              Download Template Excel
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="default"
              className="mx-auto"
            >
              View Dashboard
            </Button>
          </div>
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