import { NextRequest, NextResponse } from 'next/server';

/**
 * Download quote PDF
 * GET /api/orders/[id]/download-pdf
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337/api';
    const url = `${backendUrl}/budget/${id}/download-pdf`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Backend error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="orcamento-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[Download PDF] Error:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
