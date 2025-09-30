import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    route("success","./routes/success.tsx"),
    ...prefix("infrastruktur", [
      index("./routes/infrastruktur.tsx"),
      route("tata-ruang", "./routes/tata-ruang.tsx"),
      route("tata-bangunan", "./routes/tata-bangunan.tsx"),
      route("sumber-daya-air", "./routes/sumber-daya-air.tsx"),
      ...prefix("binamarga", [
        index("./routes/binamarga.tsx"),
        route("jalan", "./routes/jalan.tsx"),
        route("jembatan", "./routes/jembatan.tsx")
      ])
    ])
  ])
] satisfies RouteConfig;
