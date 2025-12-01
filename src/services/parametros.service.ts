import { ParametrosRepository } from '@/repositories/parametros.repository';
import {
  ParametrosOptimos,
  ComparacionOptimoReal,
  ComparacionOptimoRealTienda,
  ComparacionOptimoRealGlobal,
  ParametrosFilters,
  StatusColor,
  ResumenPorStatus,
  DashboardParametros,
  ComparacionOptimoRealFormatted,
} from '@/types/parametros';

export class ParametrosService {
  constructor(private repository: ParametrosRepository) {}

  /**
   * Obtener parámetros óptimos con formato
   */
  async getParametrosOptimos(filters?: ParametrosFilters) {
    const data = await this.repository.getParametrosOptimos(filters);

    return {
      success: true,
      data,
      total: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Obtener comparación con status de color calculado
   */
  async getComparacionConStatus(filters?: ParametrosFilters) {
    const data = await this.repository.getComparacionOptimoReal(filters);

    // Calcular status por cada registro
    const dataWithStatus: ComparacionOptimoRealFormatted[] = data.map((item) => ({
      ...item,
      status_dias_inventario: this.getStatusColor(item.desviacion_dias_inventario_pct),
      status_punto_reorden: this.getStatusColor(item.desviacion_punto_reorden_pct),
      status_tamano_pedido: this.getStatusColor(item.desviacion_tamano_pedido_pct),
      status_frecuencia: this.getStatusColor(item.desviacion_frecuencia_pct),
      ventas_totales_pesos_formatted: this.formatCurrency(item.ventas_totales_pesos || 0),
      impacto_formatted: this.formatCurrency(item.impacto || 0),
      valor_oportunidad_total_formatted: this.formatCurrency(
        (item.valor_oportunidad_dias_inventario || 0) +
        (item.valor_oportunidad_tamano_pedido || 0) +
        (item.valor_oportunidad_frecuencia || 0)
      ),
      desviacion_dias_inventario_pct_formatted: this.formatPercentage(item.desviacion_dias_inventario_pct || 0),
      desviacion_punto_reorden_pct_formatted: this.formatPercentage(item.desviacion_punto_reorden_pct || 0),
      desviacion_tamano_pedido_pct_formatted: this.formatPercentage(item.desviacion_tamano_pedido_pct || 0),
      desviacion_frecuencia_pct_formatted: this.formatPercentage(item.desviacion_frecuencia_pct || 0),
    }));

    // Calcular resumen por status (basado en dias_inventario como principal)
    const resumen = this.calcularResumenPorStatus(dataWithStatus);

    return {
      success: true,
      data: dataWithStatus,
      resumen,
      total: dataWithStatus.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Obtener dashboard consolidado completo
   */
  async getDashboardConsolidado(): Promise<DashboardParametros> {
    const [global, porTienda, topDesviaciones, topImpacto, ultimaFecha] = await Promise.all([
      this.repository.getComparacionGlobal(),
      this.repository.getTopTiendasPorImpacto(10),
      this.repository.getTopSKUsCriticos(20),
      this.repository.getComparacionOptimoReal({ ranking_limit: 20 }),
      this.repository.getUltimaFechaCalculo(),
    ]);

    // Calcular resumen de status
    const resumen = this.calcularResumenPorStatusDetalle(topDesviaciones);

    return {
      global,
      porTienda,
      topDesviaciones,
      topImpacto: topImpacto.sort((a, b) => (b.impacto || 0) - (a.impacto || 0)),
      resumenStatus: resumen,
      ultimaActualizacion: ultimaFecha.fecha,
    };
  }

  /**
   * Obtener comparación por tienda con formato
   */
  async getComparacionPorTienda(filters?: ParametrosFilters) {
    const data = await this.repository.getComparacionPorTienda(filters);

    return {
      success: true,
      data,
      total: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Obtener distribución por segmento
   */
  async getDistribucionPorSegmento() {
    const data = await this.repository.getDistribucionPorSegmento();

    return {
      success: true,
      data,
      total: data.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Helper: Determinar código de color según desviación porcentual
   * - Verde: <= 5%
   * - Amarillo: > 5% y <= 10%
   * - Rojo: > 10%
   */
  private getStatusColor(desviacion_pct: number | null): StatusColor {
    if (desviacion_pct === null) return 'green';
    
    const abs_desviacion = Math.abs(desviacion_pct);
    
    if (abs_desviacion <= 5) return 'green';
    if (abs_desviacion <= 10) return 'yellow';
    return 'red';
  }

  /**
   * Calcular resumen por status de color
   */
  private calcularResumenPorStatus(data: ComparacionOptimoRealFormatted[]): ResumenPorStatus {
    const total = data.length;
    const green = data.filter((d) => d.status_dias_inventario === 'green').length;
    const yellow = data.filter((d) => d.status_dias_inventario === 'yellow').length;
    const red = data.filter((d) => d.status_dias_inventario === 'red').length;

    return {
      total,
      green,
      yellow,
      red,
      green_pct: total > 0 ? (green / total) * 100 : 0,
      yellow_pct: total > 0 ? (yellow / total) * 100 : 0,
      red_pct: total > 0 ? (red / total) * 100 : 0,
    };
  }

  /**
   * Calcular resumen por status (sin formato previo)
   */
  private calcularResumenPorStatusDetalle(data: ComparacionOptimoReal[]): ResumenPorStatus {
    const total = data.length;
    const green = data.filter((d) => this.getStatusColor(d.desviacion_dias_inventario_pct) === 'green').length;
    const yellow = data.filter((d) => this.getStatusColor(d.desviacion_dias_inventario_pct) === 'yellow').length;
    const red = data.filter((d) => this.getStatusColor(d.desviacion_dias_inventario_pct) === 'red').length;

    return {
      total,
      green,
      yellow,
      red,
      green_pct: total > 0 ? (green / total) * 100 : 0,
      yellow_pct: total > 0 ? (yellow / total) * 100 : 0,
      red_pct: total > 0 ? (red / total) * 100 : 0,
    };
  }

  /**
   * Formatear currency en MXN
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Formatear porcentaje
   */
  private formatPercentage(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  }
}

