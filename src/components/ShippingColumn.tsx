import { ScrollArea } from "@/components/ui/scroll-area";
import { ShippingCard } from "./ShippingCard";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ShippingItem } from "@/types/shipping";

interface ShippingColumnProps {
  columnId: string;
  title: string;
  items: ShippingItem[];
  getStatusColor: (status: string) => string;
}

export const ShippingColumn = ({ columnId, title, items, getStatusColor }: ShippingColumnProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-mint-100 transition-transform hover:shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-mint-700">{title}</h2>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? "bg-mint-50" : ""
            }`}
          >
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 p-1">
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "rotate-3 scale-105" : ""}
                      >
                        <ShippingCard item={item} getStatusColor={getStatusColor} />
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