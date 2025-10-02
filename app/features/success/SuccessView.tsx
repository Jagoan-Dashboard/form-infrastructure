import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";

export function SuccessView() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex lg:items-center md:items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon
              icon="mingcute:check-fill"
              className="w-16 h-16 text-blue-600"
            />
          </div>

          {/* Success Title */}
          <h1 className="text-2xl md:text-xl font-bold text-blue-600 mb-3">
            Data Berhasil Dikirim!
          </h1>

          {/* Success Message */}
          <p className="text-gray-600 mb-8">
            Terima kasih jawaban anda telah terkirim.
          </p>

          {/* Action Button */}
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg items-center justify-center"
          >
            {/* <Icon icon="mdi:plus-circle" className="w-5 h-5" /> */}
            Isi Data Lagi
          </Button>
        </div>
      </div>
    </main>
  );
}