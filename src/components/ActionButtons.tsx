import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

interface ActionButtonsProps {
  savedInDb: boolean;
  onSave: () => void;
  rowData: any;
}

export const ActionButtons = ({ savedInDb, onSave, rowData }: ActionButtonsProps) => {
  return (
    <div className="flex items-center justify-center p-2 bg-white/95 backdrop-blur-sm h-[52px]">
      <Button
        variant={savedInDb ? "outline" : "default"}
        size="sm"
        onClick={onSave}
        className={`
          w-full transition-all duration-200 shadow-sm hover:shadow-md
          ${savedInDb 
            ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200' 
            : 'bg-mint-500 hover:bg-mint-600 text-white'}
        `}
      >
        {savedInDb ? (
          <>
            <RefreshCw className="h-4 w-4 mr-1" />
            Update
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-1" />
            Save
          </>
        )}
      </Button>
    </div>
  );
};