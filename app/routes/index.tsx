import { IndexView } from "~/features/index/IndexView";
import type { Route } from "./+types/index";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Form Infrastruktur" },
    { name: "description", content: "Form Infrastruktur" },
  ];
}

export default function Index() {
  return (
    <IndexView />
  );
}
