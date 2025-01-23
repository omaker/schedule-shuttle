import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";

interface FileUploadProps {
  onDataReceived: (data: any[]) => void;
}

export const FileUpload = ({ onDataReceived }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File Excel kosong atau tidak valid",
        });
        return;
      }

      toast({
        title: "Berhasil",
        description: "Data berhasil diupload",
      });
      
      onDataReceived(jsonData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membaca file Excel",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file?.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hanya file Excel (.xlsx) yang diperbolehkan",
      });
      return;
    }
    handleFile(file);
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 rounded-lg border-2 border-dashed transition-all duration-200 animate-fade-in ${
        isDragging
          ? "border-mint-400 bg-mint-50"
          : "border-gray-300 hover:border-mint-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Upload
          className={`w-12 h-12 ${
            isDragging ? "text-mint-500" : "text-gray-400"
          }`}
        />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">
            Drag & drop file Excel disini
          </h3>
          <p className="text-sm text-gray-500">atau</p>
          <label className="mt-2 inline-block">
            <input
              type="file"
              className="hidden"
              accept=".xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <span className="inline-block px-4 py-2 rounded-md bg-mint-500 text-white cursor-pointer hover:bg-mint-600 transition-colors">
              Pilih File
            </span>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          Format yang didukung: .xlsx (Excel)
        </p>
      </div>
    </div>
  );
};