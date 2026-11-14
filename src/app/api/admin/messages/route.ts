import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await prisma.message.count({
      where: { status: 'UNREAD' },
    });

    return NextResponse.json({ messages, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Message ID and status are required' }, { status: 400 });
    }

    const message = await prisma.message.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message, messageText: 'Message status updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
