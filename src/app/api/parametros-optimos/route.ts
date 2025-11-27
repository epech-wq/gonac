import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ParametrosOptimosRepository } from '@/repositories/parametrosOptimos.repository';
import { ParametrosOptimosService } from '@/services/parametrosOptimos.service';

/**
 * GET /api/parametros-optimos
 * Fetches optimization parameters from tab_parametros_optimos
 * 
 * Returns optimal and actual values for:
 * - Días de Inventario
 * - Punto de Reorden
 * - Tamaño de Pedido
 * - Frecuencia
 * 
 * Example:
 * - GET /api/parametros-optimos
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize repository and service
    const supabase = createServerSupabaseClient();
    const repository = new ParametrosOptimosRepository(supabase);
    const service = new ParametrosOptimosService(repository);

    const result = await service.getParametrosOptimos();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error (parametros-optimos):', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

