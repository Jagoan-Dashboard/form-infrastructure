import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

interface BinamargaType {
  id: string;
  name: string;
  icon: string;
  path: string;
}

export default function BinamargaView() {
  const navigate = useNavigate();

  const BinamargaList: BinamargaType[] = [
    {
      id: "jalan",
      name: "Jalan",
      icon: "fa6-solid:road",
      path: "/infrastruktur/binamarga/jalan",
    },
    {
      id: "jembatan",
      name: "Jembatan",
      icon: "fa6-solid:bridge-water",
      path: "/infrastruktur/binamarga/jembatan",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Pilih jenis Binamarga yang dilaporkan
      </h2>

      {/* Infrastruktur Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 max-w-xl gap-4 mb-8 mx-auto">
        {BinamargaList.map((Binamarga) => {
          return (
            <button
              key={Binamarga.id}
              onClick={() => navigate(Binamarga.path)}
              className="p-6 rounded-2xl border-2 transition-all duration-200 border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
            >
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-blue-100">
                <Icon
                  icon={Binamarga.icon}
                  className="w-8 h-8 text-blue-600"
                />
              </div>
              <p className="text-center font-semibold text-gray-700">
                {Binamarga.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="px-8 py-6 rounded-xl cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 w-full md:w-fit"
        >
          Kembali
        </Button>
      </div>
    </div>
  );
}
