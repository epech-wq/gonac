import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ValorizacionRepository } from '@/repositories/valorizacion.repository';

/**
 * POST /api/valorizacion/calcular-oportunidad
 * Calculates proposed opportunity value using SQL function
 * 
 * Body:
 * {
 *   p_dias_inventario_optimo_propuesto: number;
 *   p_tamano_pedido_optimo_propuesto: number;
 *   p_frecuencia_optima_propuesta: number;
 * }
 * Note: p_periodo_tiempo uses database default value (30)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      p_dias_inventario_optimo_propuesto,
      p_tamano_pedido_optimo_propuesto,
      p_frecuencia_optima_propuesta,
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

    // Call the SQL function (p_periodo_tiempo will use database default)
    const data = await repository.calcularValorOportunidadPropuesto({
      p_dias_inventario_optimo_propuesto,
      p_tamano_pedido_optimo_propuesto,
      p_frecuencia_optima_propuesta,
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

