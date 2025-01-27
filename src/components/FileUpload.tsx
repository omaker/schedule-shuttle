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
          
          // Convert Excel column letters to our header names
          const excelData = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
          
          const columnMapping: { [key: string]: string } = {
            "B": "EXCEL ID",
            "C": "Year",
            "D": "Month",
            "E": "Fin Month",
            "F": "Product",
            "G": "Laycan Status",
            "H": "First ETA",
            "I": "Vessel",
            "J": "Company",
            "K": "Laycan Start",
            "L": "Laycan Stop",
            "M": "ETA",
            "N": "Commence",
            "O": "ATC",
            "P": "Terminal",
            "Q": "L/R",
            "R": "Dem Rate",
            "S": "Plan Qty",
            "T": "Progress",
            "U": "Act Qty",
            "V": "LC MIN",
            "W": "LC MAX",
            "X": "Remark",
            "Y": "Est Des/(Dem)",
            "Z": "LC&CSA STATUS",
            "AA": "Total Qty",
            "AB": "Laydays",
            "AC": "Arrival",
            "AD": "Laytime Start",
            "AE": "Laytime Stop",
            "AF": "Act L/R",
            "AG": "Loading Status",
            "AH": "complete",
            "AI": "Laycan Part",
            "AJ": "Laycan Period",
            "AK": "a",
            "AL": "b",
            "AM": "Ship Code",
            "AN": "Sales Status",
            "AO": "DY",
            "AP": "Incoterm",
            "AQ": "Contract Period",
            "AR": "Direct / AIS",
            "AS": "Ship Code OMDB",
            "AT": "c",
            "AU": "d",
            "AV": "Country",
            "AW": "Sector",
            "AX": "Base Customer",
            "AY": "Region",
            "AZ": "e",
            "BA": "f",
            "BB": "Price Code",
            "BC": "Fixed/Index Linked",
            "BD": "Pricing Period",
            "BE": "Barge Adj",
            "BF": "Settled/Floating",
            "BG": "Price (FOB Vessel)",
            "BH": "Price Adj Load Port",
            "BI": "Price Adj Load Port and CV",
            "BJ": "Price FOB Vessel Adj CV",
            "BK": "Revenue",
            "BL": "Revenue Adj to Loadport",
            "BM": "Revenue adj to load port and CV",
            "BN": "Revenue FOB Vessel and CV",
            "BO": "g",
            "BP": "h",
            "BQ": "CV Typical",
            "BR": "CV Rejection",
            "BS": "CV Acceptable",
            "BT": "Blending Proportion",
            "BU": "BC IUP",
            "BV": "BC Tonnage",
            "BW": "AI Tonnage",
            "BX": "BC CV",
            "BY": "AI CV",
            "BZ": "Expected blended CV",
            "CA": "CV Typical x tonnage",
            "CB": "CV Rejection x tonnage",
            "CC": "CV Acceptable x tonnage",
            "CD": "PIT",
            "CE": "Product Marketing",
            "CF": "i",
            "CG": "j",
            "CH": "Price code non-capped",
            "CI": "Price non-capped",
            "CJ": "Price non-capped Adj LP CV Acc",
            "CK": "Revenue non-capped Adj LP CV Acc",
            "CL": "CV AR",
            "CM": "TM",
            "CN": "TS ADB",
            "CO": "ASH AR",
            "CP": "HPB Cap",
            "CQ": "HBA 2",
            "CR": "HPB Market",
            "CS": "BLU Tarif",
            "CT": "Pungutan BLU",
            "CU": "Revenue Capped",
            "CV": "Revenue Non-Capped",
            "CW": "Incremental Revenue",
            "CX": "Net BLU Expense/(Income)",
            "CY": "k",
            "CZ": "l",
            "DA": "m",
            "DB": "n",
            "DC": "o",
            "DD": "p",
            "DE": "q",
            "DF": "r",
            "DG": "s"
          };

          const mappedData = excelData.map((row: any) => {
            const newRow: any = {};
            Object.entries(row).forEach(([key, value]) => {
              if (columnMapping[key]) {
                newRow[columnMapping[key]] = value;
              }
            });
            return newRow;
          });

          if (mappedData.length === 0) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "File Excel kosong atau tidak memiliki data yang valid",
            });
            return;
          }

          console.log("Mapped data:", mappedData); // Debug log
          onDataReceived(mappedData);
          toast({
            title: "File berhasil diupload",
            description: `${mappedData.length} data berhasil diimport`,
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