import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableNumber = searchParams.get('tableNumber');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const targetUrl = tableNumber
      ? `${baseUrl}/menu?table=${encodeURIComponent(tableNumber)}`
      : `${baseUrl}/menu`;

    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    return NextResponse.json({ qrDataUrl, targetUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
