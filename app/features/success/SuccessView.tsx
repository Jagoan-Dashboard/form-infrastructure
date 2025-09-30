import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";

export function SuccessView() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon
              icon="mdi:check-circle"
              className="w-16 h-16 text-green-600"
            />
          </div>

          {/* Success Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Data Berhasil Dikirim!
          </h1>

          {/* Success Message */}
          <p className="text-gray-600 mb-8">
            Terima kasih telah mengirimkan laporan infrastruktur. Data Anda telah berhasil disimpan dan akan segera diproses.
          </p>

          {/* Action Button */}
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:plus-circle" className="w-5 h-5" />
            Isi Data Lagi
          </Button>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Anda dapat mengisi laporan baru dengan menekan tombol di atas
          </p>
        </div>
      </div>
    </main>
  );
}