import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

interface InfrastrukturType {
  id: string;
  name: string;
  icon: string;
  path: string;
  jenis: string[];
}

export default function InfrastrukturView() {
  const [selectedInfrastruktur, setSelectedInfrastruktur] = useState<
    string | null
  >(null);
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

  const infrastrukturList: InfrastrukturType[] = [
    {
      id: "tata bangunan",
      name: "Tata Bangunan",
      icon: "mynaui:building-solid",
      path: "/infrastruktur/tata-bangunan",
      jenis: ["Kantor Pemerintah", "Sekolah", "Puskesmas", "Posyandu", "Pasar", "Sarana Olahraga", "Gedung Serbaguna"],
    },
    {
      id: "tata ruang",
      name: "Tata Ruang",
      icon: "fluent:data-area-20-filled",
      path: "/infrastruktur/tata-ruang",
      jenis: ["Cagar Budaya", "Hutan", "Pariwisata", "Perkebunan", "Pemukiman", "Hankam", "Pertambangan", "Industri", "Tanaman Pangan", "Transportasi"],
    },
    {
      id: "sumber daya air",
      name: "Sumber Daya Air",
      icon: "mdi:water-pump",
      path: "/infrastruktur/sumber-daya-air",
      jenis: ["Saluran Irigasi", "Embung/Dam", "Bendung", "Pintu Air"],
    },
    {
      id: "binamarga",
      name: "Binamarga",
      icon: "fa6-solid:road",
      path: "/infrastruktur/binamarga",
      jenis: ["Jalan", "Jembatan"],
    },
  ];

  const handleSelect = (infrastruktur: InfrastrukturType) => {
    if (isMobile) {
      // Mobile: toggle selection to show jenis & button
      setSelectedInfrastruktur(
        selectedInfrastruktur === infrastruktur.id ? null : infrastruktur.id
      );
    } else {
      // Desktop: langsung navigate
      navigate(infrastruktur.path);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Pilih jenis infrastruktur yang dilaporkan
      </h2>

      {/* Infrastruktur Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {infrastrukturList.map((infrastruktur) => {
          const isSelected = selectedInfrastruktur === infrastruktur.id;

          return (
            <div key={infrastruktur.id} className="relative group">
              <button
                onClick={() => handleSelect(infrastruktur)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
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

                {/* Mobile: Show when selected */}
                {isMobile && isSelected && (
                  <>
                    <p className="mt-3 font-medium text-left">
                      Jenis Infrastruktur
                    </p>
                    <div>
                      <ul className="list-disc list-inside text-sm text-gray-600 text-left">
                        {infrastruktur.jenis.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(infrastruktur.path);
                      }}
                      className="bg-blue-600 w-full cursor-pointer mt-4 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
                    >
                      Buat Laporan
                    </Button>
                  </>
                )}
              </button>

              {/* Desktop: Tooltip on hover */}
              {!isMobile && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <p className="font-medium text-left mb-2">
                    Jenis Infrastruktur
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 text-left">
                    {infrastruktur.jenis.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
      </div>
    </div>
  );
}
