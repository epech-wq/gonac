import { VemioData } from "@/data/vemio-mock-data";

// Interfaces for the calculator
export interface SKUEnExhibicion {
  id: string;
  nombre: string;
  ventaDiaria: number;
  inventarioActual: number;
  inventarioOptimo: number;
  unidadesRequeridas: number;
  valorRequerido: number;
  precioUnitario: number;
}

export interface PedidoExtraordinario {
  unidadesTotales: number;
  valorTotal: number;
  skus: SKUEnExhibicion[];
}

export interface Oportunidad {
  id: string;
  tienda: {
    id: string;
    nombre: string;
    ubicacion: string;
    segmento: "hot";
  };
  skus: SKUEnExhibicion[];
  ventaDiariaBase: number;
  ventaIncrementalDiaria: number;
  retornoMensual: number;
  costoMensual: number;
  roi: number;
  pedidoExtraordinario: PedidoExtraordinario;
  viable: boolean;
}

export interface MetricasResumen {
  totalExhibiciones: number;
  valorPotencialTotal: number;
  costoTotalEjecucion: number;
  roiPromedio: number;
  pedidoExtraordinarioTotal: number;
  hayOportunidadesViables: boolean;
}

interface TiendaConSKUs {
  id: string;
  nombre: string;
  ubicacion: string;
  segmento: "hot";
  skus: Array<{
    id: string;
    nombre: string;
    ventasUltimos30Dias: number;
    inventarioActual: number;
    precioUnitario: number;
  }>;
}

/**
 * Calculator for additional exhibition opportunities
 * Analyzes HOT stores and their TOP SKUs to identify viable exhibition opportunities
 */
export class ExhibicionesAdicionalesCalculator {
  private data: VemioData;
  private costoExhibicion: number;
  private incrementoVentas: number;

  constructor(
    data: VemioData,
    costoExhibicion: number,
    incrementoVentas: number
  ) {
    this.data = data;
    this.costoExhibicion = costoExhibicion;
    this.incrementoVentas = incrementoVentas;
  }

  /**
   * Main calculation method that orchestrates all calculations
   * @returns Object with opportunities and summary metrics
   */
  calcularOportunidades(): {
    oportunidades: Oportunidad[];
    metricas: MetricasResumen;
  } {
    // Get HOT stores with their SKUs
    const tiendasHOT = this.filtrarTiendasHOT();

    // Calculate opportunities for each HOT store
    const oportunidades: Oportunidad[] = [];

    for (const tienda of tiendasHOT) {
      const top5SKUs = this.obtenerTop5SKUs(tienda);

      if (top5SKUs.length === 0) continue;

      // Calculate base daily sales
      const ventaDiariaBase = top5SKUs.reduce(
        (sum, sku) => sum + this.calcularVentaDiaria(sku.ventasUltimos30Dias),
        0
      );

      // Calculate incremental sales
      const ventaIncrementalDiaria =
        this.calcularVentaIncremental(ventaDiariaBase);

      // Calculate monthly return
      const retornoMensual = this.calcularRetornoMensual(
        ventaIncrementalDiaria
      );

      // Check viability
      const viable = this.esViable(retornoMensual, this.costoExhibicion);

      // Calculate ROI
      const roi = this.calcularROI(retornoMensual, this.costoExhibicion);

      // Calculate extraordinary order
      const pedidoExtraordinario = this.calcularPedidoExtraordinario(top5SKUs);

      // Build SKU details
      const skusEnExhibicion: SKUEnExhibicion[] = top5SKUs.map((sku) => {
        const ventaDiaria = this.calcularVentaDiaria(sku.ventasUltimos30Dias);
        const inventarioOptimo = this.calcularInventarioOptimo(
          sku.inventarioActual,
          this.incrementoVentas
        );
        const unidadesRequeridas = Math.max(
          0,
          inventarioOptimo - sku.inventarioActual
        );
        const valorRequerido = unidadesRequeridas * sku.precioUnitario;

        return {
          id: sku.id,
          nombre: sku.nombre,
          ventaDiaria,
          inventarioActual: sku.inventarioActual,
          inventarioOptimo,
          unidadesRequeridas,
          valorRequerido,
          precioUnitario: sku.precioUnitario,
        };
      });

      const oportunidad: Oportunidad = {
        id: `OPP-${tienda.id}`,
        tienda: {
          id: tienda.id,
          nombre: tienda.nombre,
          ubicacion: tienda.ubicacion,
          segmento: "hot",
        },
        skus: skusEnExhibicion,
        ventaDiariaBase,
        ventaIncrementalDiaria,
        retornoMensual,
        costoMensual: this.costoExhibicion,
        roi,
        pedidoExtraordinario,
        viable,
      };

      oportunidades.push(oportunidad);
    }

    // Calculate summary metrics
    const metricas = this.calcularMetricasResumen(oportunidades);

    return { oportunidades, metricas };
  }

  /**
   * Filter stores to get only HOT segment stores
   */
  private filtrarTiendasHOT(): TiendaConSKUs[] {
    const data = this.data as Record<string, unknown>;
    const tiendasSeg = data.tiendasSegmentacion as Record<string, unknown>;
    const hot = tiendasSeg.hot as Record<string, unknown>;
    const tiendasHOT = hot.stores as Array<Record<string, unknown>>;

    return tiendasHOT.map((tienda: Record<string, unknown>) => ({
      id: tienda.id as string,
      nombre: tienda.nombre as string,
      ubicacion: tienda.ubicacion as string,
      segmento: "hot" as const,
      skus: this.obtenerSKUsDeTienda(),
    }));
  }

  /**
   * Get SKUs for a specific store
   * In a real implementation, this would query store-specific SKU data
   * For now, we'll use the global SKU list with mock inventory per store
   */
  private obtenerSKUsDeTienda(): Array<{
    id: string;
    nombre: string;
    ventasUltimos30Dias: number;
    inventarioActual: number;
    precioUnitario: number;
  }> {
    // Mock: Assign SKUs to stores with varying inventory levels
    // In production, this would come from actual store-SKU relationship data
    const data = this.data as Record<string, unknown>;
    const skus = data.skus as Array<Record<string, unknown>>;
    return skus.map((sku: Record<string, unknown>) => ({
      id: sku.id as string,
      nombre: sku.nombre as string,
      ventasUltimos30Dias: sku.ventasUltimos30Dias as number,
      inventarioActual: Math.floor((sku.inventarioTotal as number) / 5), // Mock: divide total inventory among stores
      precioUnitario: this.obtenerPrecioUnitario(sku.id as string),
    }));
  }

  /**
   * Get unit price for a SKU
   * Mock prices based on SKU category
   */
  private obtenerPrecioUnitario(skuId: string): number {
    const preciosPorSKU: Record<string, number> = {
      SKU001: 200, // Producto A Premium
      SKU002: 150, // Producto B Estándar
      SKU003: 100, // Producto C Económico
      SKU004: 250, // Producto D Premium Plus
      SKU005: 180, // Producto E Familiar
    };

    return preciosPorSKU[skuId] || 150; // Default price
  }

  /**
   * Get TOP 5 SKUs by sales for a store
   */
  private obtenerTop5SKUs(
    tienda: TiendaConSKUs
  ): Array<{
    id: string;
    nombre: string;
    ventasUltimos30Dias: number;
    inventarioActual: number;
    precioUnitario: number;
  }> {
    return tienda.skus
      .sort((a, b) => b.ventasUltimos30Dias - a.ventasUltimos30Dias)
      .slice(0, 5);
  }

  /**
   * Calculate daily sales from monthly sales
   */
  private calcularVentaDiaria(ventasMensuales: number): number {
    return ventasMensuales / 30;
  }

  /**
   * Calculate incremental sales based on percentage increase
   */
  private calcularVentaIncremental(ventaBase: number): number {
    return ventaBase * (this.incrementoVentas / 100);
  }

  /**
   * Calculate monthly return from daily incremental sales
   */
  private calcularRetornoMensual(ventaIncrementalDiaria: number): number {
    return ventaIncrementalDiaria * 30;
  }

  /**
   * Determine if an opportunity is viable
   */
  private esViable(retornoMensual: number, costoMensual: number): boolean {
    return retornoMensual > costoMensual;
  }

  /**
   * Calculate ROI as a multiplier
   */
  private calcularROI(retorno: number, costo: number): number {
    if (costo === 0) return Infinity;
    return retorno / costo;
  }

  /**
   * Calculate optimal inventory considering sales increase
   */
  private calcularInventarioOptimo(
    inventarioActual: number,
    incrementoPorcentaje: number
  ): number {
    return Math.ceil(inventarioActual * (1 + incrementoPorcentaje / 100));
  }

  /**
   * Calculate extraordinary order needed to support the exhibition
   */
  private calcularPedidoExtraordinario(
    skus: Array<{
      id: string;
      nombre: string;
      ventasUltimos30Dias: number;
      inventarioActual: number;
      precioUnitario: number;
    }>
  ): PedidoExtraordinario {
    let unidadesTotales = 0;
    let valorTotal = 0;

    const skusConPedido: SKUEnExhibicion[] = skus.map((sku) => {
      const ventaDiaria = this.calcularVentaDiaria(sku.ventasUltimos30Dias);
      const inventarioOptimo = this.calcularInventarioOptimo(
        sku.inventarioActual,
        this.incrementoVentas
      );
      const unidadesRequeridas = Math.max(
        0,
        inventarioOptimo - sku.inventarioActual
      );
      const valorRequerido = unidadesRequeridas * sku.precioUnitario;

      unidadesTotales += unidadesRequeridas;
      valorTotal += valorRequerido;

      return {
        id: sku.id,
        nombre: sku.nombre,
        ventaDiaria,
        inventarioActual: sku.inventarioActual,
        inventarioOptimo,
        unidadesRequeridas,
        valorRequerido,
        precioUnitario: sku.precioUnitario,
      };
    });

    return {
      unidadesTotales,
      valorTotal,
      skus: skusConPedido,
    };
  }

  /**
   * Calculate summary metrics from all opportunities
   */
  private calcularMetricasResumen(
    oportunidades: Oportunidad[]
  ): MetricasResumen {
    const oportunidadesViables = oportunidades.filter((o) => o.viable);

    const totalExhibiciones = oportunidadesViables.length;
    const valorPotencialTotal = oportunidadesViables.reduce(
      (sum, o) => sum + o.retornoMensual,
      0
    );
    const costoTotalEjecucion =
      oportunidadesViables.length * this.costoExhibicion;
    const roiPromedio =
      oportunidadesViables.length > 0
        ? oportunidadesViables.reduce((sum, o) => sum + o.roi, 0) /
        oportunidadesViables.length
        : 0;
    const pedidoExtraordinarioTotal = oportunidadesViables.reduce(
      (sum, o) => sum + o.pedidoExtraordinario.valorTotal,
      0
    );

    return {
      totalExhibiciones,
      valorPotencialTotal,
      costoTotalEjecucion,
      roiPromedio,
      pedidoExtraordinarioTotal,
      hayOportunidadesViables: totalExhibiciones > 0,
    };
  }
}
