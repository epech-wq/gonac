import { DescuentoRepository } from '@/repositories/descuento.repository';
import {
  DescuentoParams,
  PromocionMetrics,
  PromocionResponse,
  PromocionConfig,
  CalcularPromocionRequest,
  DescuentoMetrics,
} from '@/types/descuento';

/**
 * Descuento Service
 * Contains business logic for discount promotion calculations
 */
export class DescuentoService {
  constructor(private repository: DescuentoRepository) {}

  /**
   * Calculate complete promotion metrics for PAPAS and TOTOPOS
   * Based on the configuration shown in the screenshot
   */
  async calcularPromocion(
    request: CalcularPromocionRequest
  ): Promise<PromocionResponse> {
    const {
      descuento,
      elasticidad_papas = 1.5,  // Default from screenshot
      elasticidad_totopos = 1.8, // Default from screenshot
      categorias = ['PAPAS', 'TOTOPOS'],
    } = request;

    try {
      // Calculate metrics for each category in parallel
      const [papaMetrics, totoposMetrics] = await Promise.all([
        categorias.includes('PAPAS')
          ? this.calcularMetricasCategoria(descuento, elasticidad_papas, 'PAPAS')
          : null,
        categorias.includes('TOTOPOS')
          ? this.calcularMetricasCategoria(descuento, elasticidad_totopos, 'TOTOPOS')
          : null,
      ]);

      const config: PromocionConfig = {
        descuento_maximo: descuento * 100, // Convert to percentage
        elasticidad_papas,
        elasticidad_totopos,
      };

      return {
        papas: papaMetrics,
        totopos: totoposMetrics,
        config,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Service error calculating promotion: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate metrics for a single category
   */
  private async calcularMetricasCategoria(
    descuento: number,
    elasticidad: number,
    categoria: string
  ): Promise<PromocionMetrics> {
    const params: DescuentoParams = {
      descuento,
      elasticidad,
      categoria,
    };

    const rawMetrics = await this.repository.calcularMetricasDescuento(params);

    // Calculate additional business metrics
    const inventario_post =
      rawMetrics.inventario_inicial_total - rawMetrics.ventas_plus;

    const reduccion_riesgo = this.calcularReduccionRiesgo(
      rawMetrics.inventario_inicial_total,
      rawMetrics.ventas_plus
    );

    return {
      ...rawMetrics,
      descuento_porcentaje: descuento * 100,
      elasticidad,
      categoria,
      reduccion_riesgo,
      costo_promocion: rawMetrics.valor,
      valor_capturar: rawMetrics.venta_original,
      inventario_post,
    };
  }

  /**
   * Calculate risk reduction percentage
   * Risk reduction = (ventas_plus / inventario_inicial) * 100
   */
  private calcularReduccionRiesgo(
    inventario_inicial: number,
    ventas_plus: number
  ): number {
    if (inventario_inicial === 0) return 0;
    return (ventas_plus / inventario_inicial) * 100;
  }

  /**
   * Calculate metrics for a specific discount percentage
   */
  async calcularMetricasPorDescuento(
    descuento: number,
    elasticidad_papas?: number,
    elasticidad_totopos?: number
  ): Promise<PromocionResponse> {
    return this.calcularPromocion({
      descuento,
      elasticidad_papas,
      elasticidad_totopos,
    });
  }

  /**
   * Calculate optimal discount (future enhancement)
   * This would find the discount that maximizes value or reduces risk most effectively
   */
  async calcularDescuentoOptimo(
    categoria: string,
    elasticidad: number,
    objetivo: 'maximizar_valor' | 'minimizar_costo' | 'maximizar_reduccion_riesgo' = 'maximizar_valor'
  ): Promise<{ descuento_optimo: number; metricas: PromocionMetrics }> {
    // This is a simplified version - in production you'd want to test multiple discount levels
    const descuentos = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];

    const resultados = await Promise.all(
      descuentos.map(async (descuento) => {
        const metricas = await this.calcularMetricasCategoria(
          descuento,
          elasticidad,
          categoria
        );
        return { descuento, metricas };
      })
    );

    // Find optimal based on objective
    let optimo = resultados[0];
    for (const resultado of resultados) {
      if (objetivo === 'maximizar_valor') {
        if (resultado.metricas.valor_capturar > optimo.metricas.valor_capturar) {
          optimo = resultado;
        }
      } else if (objetivo === 'minimizar_costo') {
        if (resultado.metricas.costo_promocion < optimo.metricas.costo_promocion) {
          optimo = resultado;
        }
      } else if (objetivo === 'maximizar_reduccion_riesgo') {
        if (resultado.metricas.reduccion_riesgo > optimo.metricas.reduccion_riesgo) {
          optimo = resultado;
        }
      }
    }

    return {
      descuento_optimo: optimo.descuento,
      metricas: optimo.metricas,
    };
  }

  /**
   * Compare multiple discount scenarios
   */
  async compararDescuentos(
    descuentos: number[],
    elasticidad_papas: number = 1.5,
    elasticidad_totopos: number = 1.8
  ): Promise<PromocionResponse[]> {
    const resultados = await Promise.all(
      descuentos.map((descuento) =>
        this.calcularPromocion({
          descuento,
          elasticidad_papas,
          elasticidad_totopos,
        })
      )
    );

    return resultados;
  }

  /**
   * Get available categories
   */
  async getCategoriasDisponibles(): Promise<string[]> {
    return this.repository.getCategoriasDisponibles();
  }

  /**
   * Format currency for display
   */
  formatCurrency(value: number, currency: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format number with decimals
   */
  formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }
}

