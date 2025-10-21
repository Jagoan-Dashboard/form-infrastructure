import SmartImageUploader from "./SmartImageUploader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

type ReportStatus = 'kerusakan' | 'rehabilitasi' | 'pembangunan-baru' | 'lainnya';

interface ErrorType {
    jenisPekerjaan?: string;
    kondisiSetelahRehabilitasi?: string;
    fotoKerusakan?: string;
}

export interface TataBangunanDetailsProps {
    reportStatus: ReportStatus;
    jenisPekerjaan: string;
    setJenisPekerjaan: (value: string) => void;
    kondisiSetelahRehabilitasi?: string;
    setKondisiSetelahRehabilitasi?: (value: string) => void;
    fotoKerusakan: File[];
    setFotoKerusakan: (files: File[]) => void;
    errors: ErrorType;
    submitError?: string;
    setSubmitError?: (value: string) => void;
}

const JENIS_PEKERJAAN_OPTIONS = [
    { value: 'perbaikan-atap', label: 'Perbaikan Atap' },
    { value: 'perbaikan-lantai', label: 'Perbaikan Lantai' },
    { value: 'perbaikan-dinding', label: 'Perbaikan Dinding/Cat' },
    { value: 'perbaikan-pintu-jendela', label: 'Perbaikan Pintu/Jendela' },
    { value: 'perbaikan-sanitasi', label: 'Perbaikan Sanitasi/MCK' },
    { value: 'perbaikan-listrik-air', label: 'Perbaikan Listrik/Air' },
    { value: 'lainnya', label: 'Lainnya' },
];

const KONDISI_REHABILITASI_OPTIONS = [
    { value: 'baik-siap-pakai', label: 'Baik & Siap Pakai' },
    { value: 'butuh-perbaikan', label: 'Masih Membutuhkan Perbaikan Tambahan' },
    { value: 'lainnya', label: 'Lainnya' },
];

export default function TataBangunanDetails({
    reportStatus,
    jenisPekerjaan,
    setJenisPekerjaan,
    kondisiSetelahRehabilitasi = '',
    setKondisiSetelahRehabilitasi = () => { },
    fotoKerusakan,
    setFotoKerusakan,
    errors,
    submitError,
    setSubmitError,
}: TataBangunanDetailsProps) {
    // Determine section title and image uploader label based on report status
    const getSectionTitle = () => {
        switch (reportStatus) {
            case 'kerusakan':
                return 'Detail Kerusakan';
            case 'rehabilitasi':
                return 'Detail Rehabilitasi/Perbaikan';
            default:
                return 'Detail Rehabilitasi/Perbaikan';
        }
    };

    const getImageUploaderLabel = () => {
        return reportStatus === 'kerusakan' ? 'Foto Kerusakan' : 'Foto Perbaikan';
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
                {getSectionTitle()}
            </h3>

            {(reportStatus === 'rehabilitasi' || reportStatus === 'lainnya') && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Jenis Pekerjaan Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jenis Pekerjaan<span className="text-red-500">*</span>
                        </label>
                        <Select value={jenisPekerjaan} onValueChange={setJenisPekerjaan}>
                            <SelectTrigger
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all bg-white ${errors.jenisPekerjaan
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:ring-blue-500"
                                    }`}
                            >
                                <SelectValue placeholder="Pilih Jenis Pekerjaan" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                {JENIS_PEKERJAAN_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.jenisPekerjaan && (
                            <p className="text-red-500 text-sm mt-1">{errors.jenisPekerjaan}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kondisi Setelah Rehabilitasi<span className="text-red-500">*</span>
                        </label>
                        <Select value={kondisiSetelahRehabilitasi} onValueChange={setKondisiSetelahRehabilitasi}>
                            <SelectTrigger
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all bg-white ${errors.kondisiSetelahRehabilitasi
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:ring-blue-500"
                                    }`}
                            >
                                <SelectValue placeholder="Pilih Kondisi Setelah Rehabilitasi" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                {KONDISI_REHABILITASI_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.kondisiSetelahRehabilitasi && (
                            <p className="text-red-500 text-sm mt-1">{errors.kondisiSetelahRehabilitasi}</p>
                        )}
                    </div>
                </div>
            )}

            {reportStatus === 'kerusakan' && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jenis Pekerjaan<span className="text-red-500">*</span>
                        </label>
                        <Select value={jenisPekerjaan} onValueChange={setJenisPekerjaan}>
                            <SelectTrigger
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all bg-white ${errors.jenisPekerjaan
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:ring-blue-500"
                                    }`}
                            >
                                <SelectValue placeholder="Pilih Jenis Pekerjaan" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                {JENIS_PEKERJAAN_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.jenisPekerjaan && (
                            <p className="text-red-500 text-sm mt-1">{errors.jenisPekerjaan}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Foto Kerusakan/Perbaikan */}
            <div className="md:col-span-2">
                <SmartImageUploader
                    label={getImageUploaderLabel()}
                    onFilesSelected={setFotoKerusakan}
                    maxFiles={2}
                    required
                />
                {errors.fotoKerusakan && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.fotoKerusakan}
                    </p>
                )}
            </div>

            {/* Error Message */}
            {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl md:col-span-2">
                    <p className="text-red-600 text-sm font-medium">{submitError}</p>
                </div>
            )}
        </div>
    );
}