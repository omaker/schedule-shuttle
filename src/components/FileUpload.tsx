import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onDataReceived: (data: any[]) => void;
}

export const FileUpload = ({ onDataReceived }: FileUploadProps) => {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Skip the first 6 rows and start from row 7
          const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
          range.s.r = 6; // Start from row 7 (0-based index)
          worksheet["!ref"] = XLSX.utils.encode_range(range);
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "File Excel kosong atau tidak memiliki data yang valid",
            });
            return;
          }

          onDataReceived(jsonData);
          toast({
            title: "File berhasil diupload",
            description: `${jsonData.length} data berhasil diimport`,
          });
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Gagal memproses file Excel",
          });
        }
      };

      reader.readAsBinaryString(file);
    },
    [onDataReceived, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-mint-500 bg-mint-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-mint-600">Drop file Excel di sini...</p>
        ) : (
          <>
            <p className="text-lg">
              Drag & drop file Excel di sini, atau{" "}
              <Button variant="link" className="px-1">
                pilih file
              </Button>
            </p>
            <p className="text-sm text-gray-500">
              Format yang didukung: .xlsx, .xls
            </p>
          </>
        )}
      </div>
    </div>
  );
};