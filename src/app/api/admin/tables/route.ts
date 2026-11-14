import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { tableNumber: { contains: search } },
        { floorZone: { contains: search } },
        { status: { contains: search } },
      ];
    }

    const tables = await prisma.restaurantTable.findMany({
      where,
      include: {
        orders: {
          where: {
            status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'] },
          },
          include: {
            items: {
              include: { menuItem: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { tableNumber: 'asc' },
    });

    return NextResponse.json({ tables });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tableNumber, capacity, floorZone, status } = await request.json();

    if (!tableNumber) {
      return NextResponse.json({ error: 'Table number is required' }, { status: 400 });
    }

    const table = await prisma.restaurantTable.create({
      data: {
        tableNumber,
        capacity: parseInt(capacity) || 4,
        floorZone: floorZone || 'Main Dining',
        status: status || 'AVAILABLE',
        qrCodeToken: `QR-TABLE-${tableNumber}`,
      },
    });

    return NextResponse.json({ table, message: 'Table added successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, tableNumber, capacity, floorZone, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (tableNumber !== undefined) {
      updateData.tableNumber = tableNumber;
      updateData.qrCodeToken = `QR-TABLE-${tableNumber}`;
    }
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (floorZone !== undefined) updateData.floorZone = floorZone;
    if (status !== undefined) updateData.status = status;

    const table = await prisma.restaurantTable.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ table, message: 'Table updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

    await prisma.restaurantTable.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Table deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
