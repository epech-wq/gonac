import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CambioInventarioRepository } from '@/repositories/cambioInventario.repository';
import { CambioInventarioService } from '@/services/cambioInventario.service';

/**
 * GET /api/cambio-inventario
 * Fetches inventory balancing simulation data (Cambio de Inventario action)
 * 
 * Query Parameters:
 * - format: 'simulacion' | 'detalle' (default: 'simulacion')
 * - p_dias_maximo_inventario: number (for detalle format, default: 30)
 * 
 * Examples:
 * - GET /api/cambio-inventario (simulation format)
 * - GET /api/cambio-inventario?format=detalle&p_dias_maximo_inventario=30
 * 
 * Response (simulacion):
 * {
 *   "success": true,
 *   "data": {
 *     "max_dias_inventario_destino": 30,
 *     "costo_logistico_pct": 5,
 *     ...
 *   },
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "source": "vw_simulacion_reabastecimiento"
 * }
 * 
 * Response (detalle):
 * {
 *   "success": true,
 *   "data": [...],
 *   "total": 10,
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "source": "fn_redistribucion_caducidad"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'simulacion';
    const p_dias_maximo_inventario = Number(searchParams.get('p_dias_maximo_inventario')) || 30;

    // Initialize repository and service
    const supabase = createServerSupabaseClient();
    const repository = new CambioInventarioRepository(supabase);
    const service = new CambioInventarioService(repository);

    // Handle different formats
    if (format === 'detalle') {
      const result = await service.getRedistribucionDetalle(p_dias_maximo_inventario);
      return NextResponse.json(result);
    }

    // Default: simulation format
    const result = await service.getSimulacion();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cambio Inventario API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cambio inventario data',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

