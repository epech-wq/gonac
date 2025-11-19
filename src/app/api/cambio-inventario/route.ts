import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CambioInventarioRepository } from '@/repositories/cambioInventario.repository';
import { CambioInventarioService } from '@/services/cambioInventario.service';

/**
 * GET /api/cambio-inventario
 * Fetches inventory balancing simulation data (Cambio de Inventario action)
 * 
 * Returns simulation parameters and impact metrics from vw_simulacion_reabastecimiento
 * 
 * Example:
 * - GET /api/cambio-inventario
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "max_dias_inventario_destino": 30,
 *     "costo_logistico_pct": 5,
 *     "min_unidades_mover_a_tienda": 10,
 *     "min_unidades_mover_desde_tienda": 20,
 *     "inventario_movilizar_unidades": 168,
 *     "inventario_movilizar_pesos": 46800,
 *     "num_tiendas_origen": 3,
 *     "num_tiendas_destino": 2,
 *     "dias_inventario_critico_inicial": 85,
 *     "dias_inventario_critico_final": 60,
 *     "dias_inventario_destino_inicial": 3,
 *     "dias_inventario_destino_final": 12,
 *     "costo_iniciativa": 2340
 *   },
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "source": "vw_simulacion_reabastecimiento"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize repository and service
    const supabase = createServerSupabaseClient();
    const repository = new CambioInventarioRepository(supabase);
    const service = new CambioInventarioService(repository);

    // Get simulation data
    const result = await service.getSimulacion();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Cambio Inventario API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cambio inventario simulation data',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

