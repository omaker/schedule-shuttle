import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { ArrowRight, Anchor, Ship, CheckCircle } from "lucide-react";
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
      title: "Pending at Port",
      items: [
        {
          id: "1",
          no: "COAL001",
          tanggalPengiriman: "2024-02-20",
          namaPengirim: "Kalimantan Port",
          alamatPengirim: "Samarinda Port",
          namaPenerima: "Java Power Plant",
          alamatPenerima: "Surabaya Port",
          jenisBarang: "Thermal Coal",
          berat: "50000",
          status: "pending",
        },
        {
          id: "2",
          no: "COAL002",
          tanggalPengiriman: "2024-02-21",
          namaPengirim: "Sumatra Mining",
          alamatPengirim: "Palembang Port",
          namaPenerima: "Malaysia Plant",
          alamatPenerima: "Port Klang",
          jenisBarang: "Metallurgical Coal",
          berat: "45000",
          status: "pending",
        },
        {
          id: "3",
          no: "COAL003",
          tanggalPengiriman: "2024-02-21",
          namaPengirim: "Papua Mine",
          alamatPengirim: "Sorong Port",
          namaPenerima: "Philippines Plant",
          alamatPenerima: "Manila Port",
          jenisBarang: "Steam Coal",
          berat: "55000",
          status: "pending",
        }
      ],
    },
    shipping: {
      title: "In Transit",
      items: [
        {
          id: "4",
          no: "COAL004",
          tanggalPengiriman: "2024-02-19",
          namaPengirim: "Borneo Port",
          alamatPengirim: "Balikpapan Port",
          namaPenerima: "China Plant",
          alamatPenerima: "Shanghai Port",
          jenisBarang: "Thermal Coal",
          berat: "60000",
          status: "shipping",
        },
        {
          id: "5",
          no: "COAL005",
          tanggalPengiriman: "2024-02-19",
          namaPengirim: "Sumatra Port",
          alamatPengirim: "Bengkulu Port",
          namaPenerima: "India Plant",
          alamatPenerima: "Mumbai Port",
          jenisBarang: "Coking Coal",
          berat: "48000",
          status: "shipping",
        }
      ],
    },
    delivered: {
      title: "Delivered",
      items: [
        {
          id: "6",
          no: "COAL006",
          tanggalPengiriman: "2024-02-18",
          namaPengirim: "Kalimantan Mine",
          alamatPengirim: "Banjarmasin Port",
          namaPenerima: "Korea Plant",
          alamatPenerima: "Busan Port",
          jenisBarang: "Steam Coal",
          berat: "52000",
          status: "delivered",
        },
        {
          id: "7",
          no: "COAL007",
          tanggalPengiriman: "2024-02-18",
          namaPengirim: "Sumatra Coal",
          alamatPengirim: "Lampung Port",
          namaPenerima: "Taiwan Plant",
          alamatPenerima: "Kaohsiung Port",
          jenisBarang: "Thermal Coal",
          berat: "47000",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Ship className="w-8 h-8 text-mint-600" />
            <h1 className="text-3xl font-bold text-gray-900">Coal Shipping Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Upload
          </Button>
        </div>

        <div className="flex justify-center items-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 w-[80%] h-1 bg-gradient-to-r from-mint-300 via-blue-300 to-mint-300 -translate-x-1/2 -translate-y-1/2 -z-10" />
          
          <div className="flex items-center justify-between w-full max-w-2xl relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-500 to-mint-600 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <Anchor className="text-white w-8 h-8" />
              </div>
              <span className="font-medium text-mint-700">At Port</span>
            </div>
            
            <div className="flex items-center">
              <ArrowRight className="w-8 h-8 text-mint-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-500 to-mint-600 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <Ship className="text-white w-8 h-8" />
              </div>
              <span className="font-medium text-mint-700">In Transit</span>
            </div>
            
            <div className="flex items-center">
              <ArrowRight className="w-8 h-8 text-mint-400 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-500 to-mint-600 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
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