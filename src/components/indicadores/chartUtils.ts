import { ApexOptions } from "apexcharts";
import { formatCurrency } from '@/utils/formatters';

// Month labels
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Generate mock historical trend data
 * 
 * @param currentValue - The REAL current value from database (used as last point)
 * @param variance - How much variation to allow in historical data (0.1 = ±10%)
 * @returns Array of 12 values, where the last one is the real current value
 */
export const generateTrendData = (currentValue: number, variance: number = 0.1) => {
  const historicalData = [];

  // Generate 11 previous months with realistic variation
  for (let i = 0; i < 11; i++) {
    const progress = i / 11; // 0 to ~0.91
    const randomFactor = (Math.random() - 0.5) * variance;
    // Trend upward toward current value
    const trendValue = currentValue * (0.85 + progress * 0.15) * (1 + randomFactor);
    historicalData.push(Math.round(trendValue * 100) / 100);
  }

  // Last point is the REAL current value from database
  historicalData.push(currentValue);

  return historicalData;
};

// Common chart options
export const getChartOptions = (title: string, color: string, yAxisFormatter?: (val: number) => string): ApexOptions => ({
  legend: {
    show: false,
  },
  colors: [color],
  chart: {
    fontFamily: "Outfit, sans-serif",
    height: 280,
    type: "area",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.4,
      opacityTo: 0.1,
    },
  },
  markers: {
    size: 0,
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: yAxisFormatter || ((val: number) => val.toFixed(2)),
    },
  },
  xaxis: {
    type: "category",
    categories: MONTHS,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#6B7280",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ["#6B7280"],
        fontSize: "12px",
      },
      formatter: yAxisFormatter || ((val: number) => val.toFixed(0)),
    },
  },
});
