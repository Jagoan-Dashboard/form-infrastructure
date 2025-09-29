import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    route("infrastruktur", "./routes/infrastruktur.tsx"),
    route("tata-ruang", "./routes/tata-ruang.tsx"),
    route("tata-bangunan", "./routes/tata-bangunan.tsx"),
    route("sumber-daya-air", "./routes/sumber-daya-air.tsx"),
    route("binamarga", "./routes/binamarga.tsx"),
    route("jalan", "./routes/jalan.tsx"),
    route("jembatan", "./routes/jembatan.tsx")
  ])
] satisfies RouteConfig;
