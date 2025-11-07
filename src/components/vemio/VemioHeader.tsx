import { VemioData } from "@/data/vemio-mock-data";

interface VemioHeaderProps {
  projectInfo: VemioData["projectInfo"];
}

export default function VemioHeader({ projectInfo }: VemioHeaderProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {projectInfo.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            <span className="font-semibold">{projectInfo.totalRegisters.toLocaleString()}</span> registros totales
          </p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Segmentación por Percentiles
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projectInfo.segmentation.percentiles.p25}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">P25</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {projectInfo.segmentation.percentiles.p50}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">P50</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {projectInfo.segmentation.percentiles.p75}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">P75</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {projectInfo.segmentation.percentiles.p90}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">P90</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}