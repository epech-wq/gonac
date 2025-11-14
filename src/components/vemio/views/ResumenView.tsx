import { VemioData } from "@/data/vemio-mock-data";
import TiendasConsolidadas from "../sections/TiendasConsolidadas";

interface ResumenViewProps {
  data: VemioData["resumen"];
}

export default function ResumenView({ data }: ResumenViewProps) {
  return <TiendasConsolidadas data={data} />;
}