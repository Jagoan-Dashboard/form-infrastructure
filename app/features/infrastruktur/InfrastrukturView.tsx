import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

interface InfrastrukturType {
  id: string;
  name: string;
  icon: string;
  path: string;
}

export default function InfrastrukturView() {
  const [selectedInfrastruktur, setSelectedInfrastruktur] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const infrastrukturList: InfrastrukturType[] = [
    {
      id: "tata bangunan",
      name: "Tata Bangunan",
      icon: "mynaui:building-solid",
      path: "/tata-bangunan"
    },
    {
      id: "tata ruang",
      name: "Tata Ruang",
      icon: "fluent:data-area-20-filled",
      path: "/tata-ruang"
    },
    {
      id: "sumber daya air",
      name: "Sumber Daya Air",
      icon: "mdi:water-pump",
      path: "/sumber-daya-air"
    },
    {
      id: "binamarga",
      name: "Binamarga",
      icon: "fa6-solid:road",
      path: "/binamarga"
    },
  ];

  const handleSelect = (id: string) => {
    setSelectedInfrastruktur(id);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Pilih jenis infrastruktur yang dilaporkan
      </h2>

      {/* Infrastruktur Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {infrastrukturList.map((infrastruktur) => {
          const isSelected = selectedInfrastruktur === infrastruktur.id;

          return (
            <button
              key={infrastruktur.id}
              onClick={() => handleSelect(infrastruktur.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  isSelected ? "bg-blue-600" : "bg-blue-100"
                }`}
              >
                <Icon
                  icon={infrastruktur.icon}
                  className={`w-8 h-8 ${
                    isSelected ? "text-white" : "text-blue-600"
                  }`}
                />
              </div>
              <p
                className={`text-center font-semibold ${
                  isSelected ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {infrastruktur.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="px-8 py-6 rounded-xl cursor-pointer  border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
        >
          Kembali
        </Button>
        <Button
          onClick={() => navigate("/tata-ruang")}
          disabled={!selectedInfrastruktur}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-6 px-10 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
          <Icon icon="material-symbols:chevron-right" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
