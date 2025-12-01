import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ParametrosRepository } from '@/repositories/parametros.repository';
import { ParametrosService } from '@/services/parametros.service';
import { ParametrosFilters } from '@/types/parametros';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const repository = new ParametrosRepository(supabase);
    const service = new ParametrosService(repository);

    const { searchParams } = new URL(request.url);
    
    // Parámetros de vista
    const view = searchParams.get('view') || 'detalle'; // detalle, tienda, global, dashboard
    
    // Parámetros de filtros
    const id_store = searchParams.get('id_store');
    const sku = searchParams.get('sku');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const segment = searchParams.get('segment');
    const region = searchParams.get('region');
    const store_name = searchParams.get('store_name');
    const ranking_limit = searchParams.get('ranking_limit');
    const min_impacto = searchParams.get('min_impacto');
    const tendencia = searchParams.get('tendencia');

    // Construir objeto de filtros
    const filters: ParametrosFilters = {
      id_store: id_store ? parseInt(id_store) : undefined,
      sku: sku ? parseInt(sku) : undefined,
      category: category || undefined,
      brand: brand || undefined,
      segment: segment || undefined,
      region: region || undefined,
      store_name: store_name || undefined,
      ranking_limit: ranking_limit ? parseInt(ranking_limit) : undefined,
      min_impacto: min_impacto ? parseFloat(min_impacto) : undefined,
      tendencia: tendencia || undefined,
    };

    let result;

    switch (view) {
      case 'dashboard':
        // Vista completa con todas las agregaciones
        result = await service.getDashboardConsolidado();
        break;

      case 'global':
        // Vista global agregada
        const global = await repository.getComparacionGlobal();
        result = {
          success: true,
          data: global,
          timestamp: new Date().toISOString(),
        };
        break;

      case 'tienda':
        // Vista agregada por tienda
        result = await service.getComparacionPorTienda(filters);
        break;

      case 'segmento':
        // Distribución por segmento
        result = await service.getDistribucionPorSegmento();
        break;

      case 'base':
        // Tabla base de parámetros óptimos
        result = await service.getParametrosOptimos(filters);
        break;

      case 'detalle':
      default:
        // Vista detallada con status de colores
        result = await service.getComparacionConStatus(filters);
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in parametros API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

