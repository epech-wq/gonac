import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { SegmentacionRepository } from '@/repositories/segmentacion.repository';
import { SegmentacionService } from '@/services/segmentacion.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'raw'; // Default to raw

    const supabase = createServerSupabaseClient();
    const repository = new SegmentacionRepository(supabase);
    const service = new SegmentacionService(repository);

    switch (format) {
      case 'raw':
        const raw = await service.getMetrics();
        return NextResponse.json(raw);
      case 'formatted':
        const formatted = await service.getFormatted();
        return NextResponse.json(formatted);
      case 'detalle':
        const detalle = await service.getDetalle();
        return NextResponse.json(detalle);
      case 'grouped':
        const grouped = await service.getDetalleGrouped();
        return NextResponse.json(grouped);
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid format',
            message: 'Format must be "raw", "formatted", "detalle", or "grouped"',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Segmentacion API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch segmentacion data',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
