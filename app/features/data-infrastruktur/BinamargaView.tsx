import { useState, useEffect } from "react";
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
  const [selectedBinamarga, setSelectedBinamarga] = useState<string | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl gap-4 mb-8 mx-auto">
        {BinamargaList.map((Binamarga) => {
          const isSelected = selectedBinamarga === Binamarga.id;

          return (
            <button
              key={Binamarga.id}
              onClick={() =>
                setSelectedBinamarga(
                  selectedBinamarga === Binamarga.id ? null : Binamarga.id
                )
              }
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
                  icon={Binamarga.icon}
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
                {Binamarga.name}
              </p>

              {/* Mobile: Show button when selected */}
              {isMobile && isSelected && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(Binamarga.path);
                  }}
                  className="bg-blue-600 w-full cursor-pointer mt-4 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
                >
                  Buat Laporan
                </Button>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate("/infrastruktur")}
          variant="outline"
          className="px-8 py-6 rounded-xl cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
        >
          Kembali
        </Button>
        {/* Desktop: Next button always visible, enabled when selected */}
        {!isMobile && (
          <Button
            onClick={() => {
              const selected = BinamargaList.find(
                (item) => item.id === selectedBinamarga
              );
              if (selected) {
                navigate(selected.path);
              }
            }}
            disabled={!selectedBinamarga}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </Button>
        )}
      </div>
    </div>
  );
}
