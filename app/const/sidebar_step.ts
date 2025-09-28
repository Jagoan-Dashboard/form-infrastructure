import type { SidebarStep } from "~/types/sidebar";

export const ALL_STEPS: SidebarStep[] = [
  { number: 1, title: 'Data Pelapor', desc: 'Masukan identitas pelapor.', path: '/' },
  { number: 2, title: 'Jenis Infrastruktur', desc: 'Pilih jenis infrastruktur yang akan dilaporkan.', path: '/infrastruktur' },
  { number: 3, title: 'Data Infrastruktur', desc: 'Lengkapi informasi detail terkait infrastruktur', path: '/tata-ruang' },
];