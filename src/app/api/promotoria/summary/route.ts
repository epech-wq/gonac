import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PromotoriaRepository } from '@/repositories/promotoria.repository';
import { PromotoriaService } from '@/services/promotoria.service';

/**
 * GET /api/promotoria/summary
 * Get global promotoria summary (tiendas_a_visitar, riesgo_total)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "tiendas_a_visitar": 22,
 *     "riesgo_total": 29153.5
 *   },
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const repository = new PromotoriaRepository(supabase);
    const service = new PromotoriaService(repository);

    const result = await service.getSummary();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Promotoria Summary API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch promotoria summary',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

