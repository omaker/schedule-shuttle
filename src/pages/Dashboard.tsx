import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ArrowRight, Package, Truck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShippingColumn } from "@/components/ShippingColumn";
import { Columns, ShippingItem } from "@/types/shipping";

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
  const [columns, setColumns] = useState<Columns>({
    pending: {
      title: "Pending",
      items: [
        {
          id: "1",
          no: "001",
          tanggalPengiriman: "2024-02-20",
          namaPengirim: "John Doe",
          alamatPengirim: "Jakarta Selatan",
          namaPenerima: "Jane Smith",
          alamatPenerima: "Surabaya Pusat",
          jenisBarang: "Electronics",
          berat: "5",
          status: "pending",
        },
        {
          id: "2",
          no: "002",
          tanggalPengiriman: "2024-02-21",
          namaPengirim: "Alice Johnson",
          alamatPengirim: "Bandung",
          namaPenerima: "Bob Wilson",
          alamatPenerima: "Medan",
          jenisBarang: "Furniture",
          berat: "15",
          status: "pending",
        },
        {
          id: "3",
          no: "003",
          tanggalPengiriman: "2024-02-21",
          namaPengirim: "Sarah Lee",
          alamatPengirim: "Yogyakarta",
          namaPenerima: "Mike Brown",
          alamatPenerima: "Bali",
          jenisBarang: "Food Products",
          berat: "8",
          status: "pending",
        }
      ],
    },
    shipping: {
      title: "Shipping",
      items: [
        {
          id: "4",
          no: "004",
          tanggalPengiriman: "2024-02-19",
          namaPengirim: "David Chen",
          alamatPengirim: "Semarang",
          namaPenerima: "Emma Davis",
          alamatPenerima: "Palembang",
          jenisBarang: "Books",
          berat: "3",
          status: "shipping",
        },
        {
          id: "5",
          no: "005",
          tanggalPengiriman: "2024-02-19",
          namaPengirim: "Tom Wilson",
          alamatPengirim: "Malang",
          namaPenerima: "Lisa Anderson",
          alamatPenerima: "Makassar",
          jenisBarang: "Clothing",
          berat: "2",
          status: "shipping",
        }
      ],
    },
    delivered: {
      title: "Delivered",
      items: [
        {
          id: "6",
          no: "006",
          tanggalPengiriman: "2024-02-18",
          namaPengirim: "Chris Martin",
          alamatPengirim: "Surabaya",
          namaPenerima: "Diana Ross",
          alamatPenerima: "Jakarta Utara",
          jenisBarang: "Art Supplies",
          berat: "4",
          status: "delivered",
        },
        {
          id: "7",
          no: "007",
          tanggalPengiriman: "2024-02-18",
          namaPengirim: "Kevin Park",
          alamatPengirim: "Bogor",
          namaPenerima: "Rachel Green",
          alamatPenerima: "Tangerang",
          jenisBarang: "Sports Equipment",
          berat: "10",
          status: "delivered",
        },
        {
          id: "8",
          no: "008",
          tanggalPengiriman: "2024-02-17",
          namaPengirim: "Maria Garcia",
          alamatPengirim: "Depok",
          namaPenerima: "Paul Walker",
          alamatPenerima: "Bekasi",
          jenisBarang: "Musical Instruments",
          berat: "7",
          status: "delivered",
        }
      ],
    },
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
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
      const column = columns[source.droppableId];
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

        <div className="flex justify-center items-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 w-[80%] h-0.5 bg-mint-300 -translate-x-1/2 -translate-y-1/2 -z-10" />
          
          <div className="flex items-center justify-between w-full max-w-2xl relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-mint-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <Package className="text-white w-8 h-8" />
              </div>
              <span className="font-medium text-mint-700">Package Ready</span>
            </div>
            
            <div className="flex items-center">
              <ArrowRight className="w-8 h-8 text-mint-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-mint-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <Truck className="text-white w-8 h-8" />
              </div>
              <span className="font-medium text-mint-700">In Transit</span>
            </div>
            
            <div className="flex items-center">
              <ArrowRight className="w-8 h-8 text-mint-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-mint-500 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <CheckCircle className="text-white w-8 h-8" />
              </div>
              <span className="font-medium text-mint-700">Delivered</span>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <ShippingColumn
                key={columnId}
                columnId={columnId}
                title={column.title}
                items={column.items}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
