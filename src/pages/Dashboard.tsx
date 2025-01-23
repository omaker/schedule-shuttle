import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Truck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ShippingItem {
  id: string;
  no: string;
  tanggalPengiriman: string;
  namaPengirim: string;
  alamatPengirim: string;
  namaPenerima: string;
  alamatPenerima: string;
  jenisBarang: string;
  berat: string;
  status: "pending" | "shipping" | "delivered";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "shipping":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState({
    pending: {
      title: "Pending",
      items: [
        {
          id: "1",
          no: "001",
          tanggalPengiriman: "2024-02-20",
          namaPengirim: "John Doe",
          alamatPengirim: "Jakarta",
          namaPenerima: "Jane Smith",
          alamatPenerima: "Surabaya",
          jenisBarang: "Electronics",
          berat: "5",
          status: "pending",
        },
      ] as ShippingItem[],
    },
    shipping: {
      title: "Shipping",
      items: [] as ShippingItem[],
    },
    delivered: {
      title: "Delivered",
      items: [] as ShippingItem[],
    },
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns];
      const destColumn = columns[destination.droppableId as keyof typeof columns];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, {
        ...removed,
        status: destination.droppableId as ShippingItem["status"],
      });
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId as keyof typeof columns];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipping Dashboard</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Upload
          </Button>
        </div>

        <div className="flex justify-center items-center mb-12 space-x-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center">
              <Package className="text-white" />
            </div>
            <ArrowRight className="mx-4 text-gray-400" />
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center">
              <Truck className="text-white" />
            </div>
            <ArrowRight className="mx-4 text-gray-400" />
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-mint-500 flex items-center justify-center">
              <CheckCircle className="text-white" />
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 hover:shadow-lg transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  #{item.no}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <p className="font-medium">{item.jenisBarang}</p>
                                <div className="text-sm text-gray-600">
                                  <p>From: {item.namaPengirim}</p>
                                  <p>To: {item.namaPenerima}</p>
                                  <p>Weight: {item.berat} kg</p>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;