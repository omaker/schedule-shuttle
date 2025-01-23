import { ScrollArea } from "@/components/ui/scroll-area";
import { ShippingCard } from "./ShippingCard";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ShippingItem } from "@/types/shipping";

interface ShippingColumnProps {
  columnId: string;
  title: string;
  items: ShippingItem[];
  getStatusColor: (status: string) => string;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
}

export const ShippingColumn = ({ 
  columnId, 
  title, 
  items, 
  getStatusColor,
  selectedItems,
  onSelectItem 
}: ShippingColumnProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-mint-100 transition-transform hover:shadow-xl">
      <h2 className="text-lg font-semibold mb-3 text-mint-700">{title}</h2>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? "bg-mint-50" : ""
            }`}
          >
            <ScrollArea className="h-[700px]">
              <div className="space-y-2 p-1">
                {items.map((item, index) => (
                  <Draggable 
                    key={item.id} 
                    draggableId={item.id} 
                    index={index}
                    isDragDisabled={!selectedItems.includes(item.id) && selectedItems.length > 0}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "rotate-2 scale-105" : ""}
                      >
                        <ShippingCard 
                          item={item} 
                          getStatusColor={getStatusColor}
                          isSelected={selectedItems.includes(item.id)}
                          onSelect={onSelectItem}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </ScrollArea>
          </div>
        )}
      </Droppable>
    </div>
  );
};