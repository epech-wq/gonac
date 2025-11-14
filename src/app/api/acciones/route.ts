import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { AccionesRepository } from '@/repositories/acciones.repository';
import { AccionesService } from '@/services/acciones.service';

/**
 * GET /api/acciones
 * Fetches acciones resumen data (Historial de Tareas y Acciones)
 * 
 * Query Parameters:
 * - format: 'default' | 'with-metrics' | 'detalle' (optional)
 * 
 * Examples:
 * - GET /api/acciones (default format)
 * - GET /api/acciones?format=with-metrics
 * - GET /api/acciones?format=detalle
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'default';

    // Initialize repository and service
    const supabase = createServerSupabaseClient();
    const repository = new AccionesRepository(supabase);
    const service = new AccionesService(repository);

    // Handle detail format
    if (format === 'detalle') {
      const result = await service.getAccionesDetalle();
      return NextResponse.json({
        success: true,
        ...result,
      });
    }

    // Fetch data
    const result = await service.getAccionesResumen();

    // Handle different formats
    let data;
    switch (format) {
      case 'with-metrics':
        data = service.calculateMetrics(result.data);
        break;
      default:
        data = result.data;
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error('Acciones API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch acciones data',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/acciones/refresh
 * Manually trigger data refresh (if needed for caching)
 */
export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    const repository = new AccionesRepository(supabase);
    const service = new AccionesService(repository);

    const result = await service.getAccionesResumen();

    return NextResponse.json({
      success: true,
      message: 'Data refreshed successfully',
      data: result.data,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error('Acciones Refresh Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh acciones data',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

