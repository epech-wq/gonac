import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DescuentoRepository } from '@/repositories/descuento.repository';
import { DescuentoService } from '@/services/descuento.service';

/**
 * POST /api/descuento/comparar
 * Compare multiple discount scenarios
 * 
 * Body:
 * {
 *   descuentos: number[] - Array of discount percentages
 *   elasticidad_papas?: number
 *   elasticidad_totopos?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { descuentos, elasticidad_papas, elasticidad_totopos } = body;

    // Validate
    if (!Array.isArray(descuentos) || descuentos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          message: 'descuentos must be a non-empty array of numbers',
        },
        { status: 400 }
      );
    }

    // Validate each discount
    for (const descuento of descuentos) {
      if (typeof descuento !== 'number' || descuento < 0 || descuento > 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid descuento value',
            message: 'All descuentos must be between 0 and 1',
          },
          { status: 400 }
        );
      }
    }

    // Initialize service
    const supabase = createServerSupabaseClient();
    const repository = new DescuentoRepository(supabase);
    const service = new DescuentoService(repository);

    // Compare discounts
    const data = await service.compararDescuentos(
      descuentos,
      elasticidad_papas,
      elasticidad_totopos
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Descuento Compare API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to compare discount scenarios',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

