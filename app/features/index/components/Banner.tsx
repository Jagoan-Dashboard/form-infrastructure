import { assets } from "~/assets/assets";

export default function Banner() {
  return (
    <div className="">
      {/* Hero Banner */}
      <div
        className="relative rounded-3xl p-8 md:p-12 mb-5 text-white overflow-hidden "
        style={{
          backgroundImage: `linear-gradient(to top, rgba(41, 68, 204, 1), rgba(41, 68, 204, 0.55), rgba(41, 68, 204, 0.35)), url(${assets.imageBaner})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            Selamat Datang!
          </h1>
          <h2 className="text-lg md:text-2xl font-semibold mb-4 text-green-50">
            Formulir Pelaporan Infrastruktur Kabupaten Ngawi
          </h2>
          <p className="text-xs md:text-base text-green-50 leading-relaxed max-w-3xl mb-4">
            Formulir ini adalah formulir pelaporan kondisi infrastruktur
            Kabupaten Ngawi. Formulir ini bertujuan untuk mengumpulkan data
            lengkap terkait Infrastruktur yang ada di seluruh area Kabupaten
            Ngawi.
          </p>
          <p className="text-xs md:text-base text-green-50 leading-relaxed max-w-3xl">
            <i>Lengkapi formulir ini dengan teliti.</i>
          </p>
        </div>
      </div>
    </div>
  );
}
