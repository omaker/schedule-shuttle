import { ScrollArea } from "@/components/ui/scroll-area";
import { ShippingCard } from "./ShippingCard";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ShippingItem } from "@/types/shipping";
import { useState, useRef } from "react";

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
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const columnRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Reset selection if clicking outside of any card
    const target = e.target as HTMLElement;
    if (!target.closest('.shipping-card')) {
      if (columnRef.current) {
        const rect = columnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
        setIsSelecting(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && columnRef.current) {
      const rect = columnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectionEnd({ x, y });

      // Get all cards within selection box
      const cards = columnRef.current.getElementsByClassName('shipping-card');
      Array.from(cards).forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = {
          x: cardRect.left + cardRect.width / 2 - rect.left,
          y: cardRect.top + cardRect.height / 2 - rect.top
        };

        const selectionBox = {
          left: Math.min(selectionStart.x, x),
          right: Math.max(selectionStart.x, x),
          top: Math.min(selectionStart.y, y),
          bottom: Math.max(selectionStart.y, y)
        };

        if (
          cardCenter.x >= selectionBox.left &&
          cardCenter.x <= selectionBox.right &&
          cardCenter.y >= selectionBox.top &&
          cardCenter.y <= selectionBox.bottom
        ) {
          const itemId = card.getAttribute('data-item-id');
          if (itemId && !selectedItems.includes(itemId)) {
            onSelectItem(itemId);
          }
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-lg border-2 border-mint-100 transition-transform hover:shadow-xl relative"
      ref={columnRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
                  >
                    {(provided, snapshot) => {
                      // Check if any item in the same group is being dragged
                      const isAnyGroupItemDragging = selectedItems.some(id => 
                        document.querySelector(`[data-rbd-draggable-id="${id}"]`)?.getAttribute('aria-grabbed') === 'true'
                      );

                      // Apply animation if this item is selected and either it's being dragged or any item in its group is being dragged
                      const shouldAnimate = selectedItems.includes(item.id) && (snapshot.isDragging || isAnyGroupItemDragging);

                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`shipping-card ${
                            shouldAnimate ? "rotate-2 scale-105 shadow-lg" : ""
                          }`}
                          data-item-id={item.id}
                        >
                          <ShippingCard 
                            item={item} 
                            getStatusColor={getStatusColor}
                            isSelected={selectedItems.includes(item.id)}
                            onSelect={() => {}}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </ScrollArea>
          </div>
        )}
      </Droppable>
      {isSelecting && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(selectionStart.x, selectionEnd.x),
            top: Math.min(selectionStart.y, selectionEnd.y),
            width: Math.abs(selectionEnd.x - selectionStart.x),
            height: Math.abs(selectionEnd.y - selectionStart.y),
            backgroundColor: 'rgba(0, 200, 150, 0.1)',
            border: '2px solid rgba(0, 200, 150, 0.5)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}
    </div>
  );
};