import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DescuentoRepository } from '@/repositories/descuento.repository';
import { DescuentoService } from '@/services/descuento.service';

/**
 * GET /api/descuento
 * Calculate discount promotion metrics
 * 
 * Query params:
 * - descuento: number (required) - Discount percentage as decimal (0.41 = 41%)
 * - elasticidad_papas: number (optional) - Default: 1.5
 * - elasticidad_totopos: number (optional) - Default: 1.8
 * - categorias: string (optional) - Comma-separated categories
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse parameters
    const descuentoParam = searchParams.get('descuento');
    const elasticidadPapasParam = searchParams.get('elasticidad_papas');
    const elasticidadTotoposParam = searchParams.get('elasticidad_totopos');
    const categoriasParam = searchParams.get('categorias');

    // Validate required parameter
    if (!descuentoParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: descuento',
          message: 'Please provide descuento as a decimal (e.g., 0.41 for 41%)',
        },
        { status: 400 }
      );
    }

    const descuento = parseFloat(descuentoParam);

    if (isNaN(descuento) || descuento < 0 || descuento > 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid descuento value',
          message: 'Descuento must be between 0 and 1',
        },
        { status: 400 }
      );
    }

    // Parse optional parameters
    const elasticidad_papas = elasticidadPapasParam
      ? parseFloat(elasticidadPapasParam)
      : undefined;
    const elasticidad_totopos = elasticidadTotoposParam
      ? parseFloat(elasticidadTotoposParam)
      : undefined;
    const categorias = categoriasParam
      ? categoriasParam.split(',').map((c) => c.trim())
      : undefined;

    // Initialize service
    const supabase = createServerSupabaseClient();
    const repository = new DescuentoRepository(supabase);
    const service = new DescuentoService(repository);

    // Calculate promotion
    const data = await service.calcularPromocion({
      descuento,
      elasticidad_papas,
      elasticidad_totopos,
      categorias,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Descuento API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate discount metrics',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/descuento
 * Calculate discount promotion with more complex options
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { descuento, elasticidad_papas, elasticidad_totopos, categorias } = body;

    // Validate
    if (typeof descuento !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          message: 'descuento is required and must be a number',
        },
        { status: 400 }
      );
    }

    if (descuento < 0 || descuento > 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid descuento value',
          message: 'descuento must be between 0 and 1',
        },
        { status: 400 }
      );
    }

    // Initialize service
    const supabase = createServerSupabaseClient();
    const repository = new DescuentoRepository(supabase);
    const service = new DescuentoService(repository);

    // Calculate promotion
    const data = await service.calcularPromocion({
      descuento,
      elasticidad_papas,
      elasticidad_totopos,
      categorias,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Descuento API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate discount metrics',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

