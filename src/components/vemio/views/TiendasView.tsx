import { VemioData } from "@/data/vemio-mock-data";
import TiendasConsolidadas from "../sections/TiendasConsolidadas";

interface TiendasViewProps {
  data: VemioData;
}

export default function TiendasView({ data }: TiendasViewProps) {
  return <TiendasConsolidadas data={data} />;
}
