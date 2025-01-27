import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonsProps {
  savedInDb: boolean;
  onSave: () => void;
  rowData: any;
}

export const ActionButtons = ({ savedInDb, onSave, rowData }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col items-start space-y-2 p-2 bg-white/95 backdrop-blur-sm ring-1 ring-black/5">
      <div className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
        {rowData["Vessel"] || "No Vessel"}
      </div>
      <Tooltip>
        <TooltipTrigger>
          {savedInDb ? (
            <Badge variant="outline" className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              Saved
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
              <X className="h-4 w-4 text-yellow-500 mr-1" />
              Not Saved
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>
          {savedInDb ? 'Click Update to modify data' : 'Click Save to store in database'}
        </TooltipContent>
      </Tooltip>
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