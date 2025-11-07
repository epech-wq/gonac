import { VemioData } from "@/data/vemio-mock-data";

interface VemioHeaderProps {
  projectInfo: VemioData["projectInfo"];
}

export default function VemioHeader({ projectInfo }: VemioHeaderProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {projectInfo.name}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          <span className="font-semibold">{projectInfo.totalRegisters.toLocaleString()}</span> registros totales
        </p>
      </div>
    </div>
  );
}