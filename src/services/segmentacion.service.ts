import { SegmentacionRepository } from '@/repositories/segmentacion.repository';
import {
  SegmentacionMetricsResponse,
  SegmentacionDetalleResponse,
  SegmentacionDetalleGrouped,
  SegmentacionFormatted,
} from '@/types/segmentacion';

export class SegmentacionService {
  constructor(private repository: SegmentacionRepository) { }

  /**
   * Get raw segmentation metrics
   */
  async getMetrics(): Promise<SegmentacionMetricsResponse> {
    try {
      const data = await this.repository.getMetrics();
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting segmentacion metrics: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get detailed metrics by store and segment
   */
  async getDetalle(): Promise<SegmentacionDetalleResponse> {
    try {
      const data = await this.repository.getDetalle();
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting segmentacion detalle: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get detailed metrics grouped by segment
   */
  async getDetalleGrouped(): Promise<SegmentacionDetalleGrouped> {
    try {
      const data = await this.repository.getDetalle();

      // Group by segment
      const grouped = data.reduce((acc, item) => {
        const segment = item.segment;
        if (!acc[segment]) {
          acc[segment] = [];
        }

        // Remove segment field from the item
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { segment: _, ...storeData } = item;
        acc[segment].push(storeData);

        return acc;
      }, {} as Record<string, Omit<typeof data[0], 'segment'>[]>);

      // Get unique segments
      const segments = Object.keys(grouped).sort();

      return {
        success: true,
        data: grouped,
        total: data.length,
        segments,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting grouped segmentacion detalle: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get formatted segmentation metrics with cards and summary
   */
  async getFormatted(): Promise<SegmentacionFormatted> {
    try {
      const data = await this.repository.getMetrics();

      // Create cards with formatted values
      const cards = data.map((segment) => ({
        segment: segment.segment,
        ventas_valor: `$${segment.ventas_valor.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        ventas_unidades: segment.ventas_unidades.toLocaleString('en-US'),
        dias_inventario: segment.dias_inventario.toFixed(1),
        contribucion_porcentaje: `${segment.contribucion_porcentaje.toFixed(1)}%`,
        num_tiendas_segmento: segment.num_tiendas_segmento,
        participacion_segmento: `${segment.participacion_segmento.toFixed(1)}%`,
        ventas_semana_promedio_tienda_pesos: `$${segment.ventas_semana_promedio_tienda_pesos.toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`,
        ventas_semana_promedio_tienda_unidades:
          segment.ventas_semana_promedio_tienda_unidades.toFixed(1),
      }));

      // Calculate summary
      const totalVentasValor = data.reduce(
        (sum, item) => sum + item.ventas_valor,
        0
      );
      const totalVentasUnidades = data.reduce(
        (sum, item) => sum + item.ventas_unidades,
        0
      );
      const promedioDiasInventario =
        data.reduce((sum, item) => sum + item.dias_inventario, 0) / data.length;
      const totalTiendas = data.reduce(
        (sum, item) => sum + item.num_tiendas_segmento,
        0
      );

      const summary = {
        total_ventas_valor: `$${totalVentasValor.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        total_ventas_unidades: totalVentasUnidades.toLocaleString('en-US'),
        promedio_dias_inventario: promedioDiasInventario.toFixed(1),
        total_tiendas: totalTiendas,
      };

      return {
        success: true,
        cards,
        summary,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting formatted segmentacion: ${(error as Error).message}`
      );
    }
  }
}
