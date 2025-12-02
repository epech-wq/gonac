import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ValorizacionRepository } from '@/repositories/valorizacion.repository';

/**
 * POST /api/valorizacion/calcular-oportunidad
 * Calculates global impact using optimal parameters
 * Uses: maquinsa.fn_calcular_impacto_optimos_globales
 * 
 * Body:
 * {
 *   p_dias_inventario_optimo_propuesto: number;
 *   p_tamano_pedido_optimo_propuesto: number;
 *   p_frecuencia_optima_propuesta: number;
 *   p_periodo_tiempo?: number; // optional, defaults to 30
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      p_dias_inventario_optimo_propuesto,
      p_tamano_pedido_optimo_propuesto,
      p_frecuencia_optima_propuesta,
      p_periodo_tiempo,
    } = body;

    // Validate required parameters
    if (
      p_dias_inventario_optimo_propuesto === undefined ||
      p_tamano_pedido_optimo_propuesto === undefined ||
      p_frecuencia_optima_propuesta === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters',
          message: 'p_dias_inventario_optimo_propuesto, p_tamano_pedido_optimo_propuesto, and p_frecuencia_optima_propuesta are required',
        },
        { status: 400 }
      );
    }

    // Initialize repository
    const supabase = createServerSupabaseClient();
    const repository = new ValorizacionRepository(supabase);

    // Call the new SQL function fn_calcular_impacto_optimos_globales
    const data = await repository.calcularImpactoOptimosGlobales({
      p_dias_inventario_optimo_global: p_dias_inventario_optimo_propuesto,
      p_tamano_pedido_optimo_global: p_tamano_pedido_optimo_propuesto,
      p_frecuencia_optima_global: p_frecuencia_optima_propuesta,
      p_periodo_tiempo: p_periodo_tiempo || 30,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Calcular Oportunidad API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate opportunity value',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

