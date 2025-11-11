import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PromotoriaRepository } from '@/repositories/promotoria.repository';
import { PromotoriaService } from '@/services/promotoria.service';

/**
 * GET /api/promotoria/products
 * Get top products without sales (highest risk)
 * 
 * Query Parameters:
 * - limit: number (default: 3) - Number of products to return
 * 
 * Example:
 * - GET /api/promotoria/products?limit=3
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "product_name": "Papas Chidas Picositas",
 *       "ventas_totales_unidades": 0,
 *       "inventario_sin_rotacion": 405,
 *       "precio_individual": 108,
 *       "riesgo": 1215
 *     }
 *   ],
 *   "total": 3,
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    const supabase = createServerSupabaseClient();
    const repository = new PromotoriaRepository(supabase);
    const service = new PromotoriaService(repository);

    const result = await service.getProductsSinVenta(limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Promotoria Products API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products sin venta',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

