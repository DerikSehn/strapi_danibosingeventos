import { NextRequest, NextResponse } from 'next/server';

/**
 * Send quote PDF via email
 * POST /api/orders/[id]/send-pdf
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337/api';
    const url = `${backendUrl}/budget/${id}/send-pdf`;

    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Backend error:', response.status, errorData);
      
      return NextResponse.json(
        { error: errorData.message || 'Failed to send PDF' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[Send PDF] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send PDF' },
      { status: 500 }
    );
  }
}
