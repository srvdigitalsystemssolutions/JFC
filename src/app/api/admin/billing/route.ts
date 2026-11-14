import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (status && status !== 'ALL') {
      where.paymentStatus = status;
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { order: { customerName: { contains: search } } },
        { order: { orderNumber: { contains: search } } },
      ];
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        order: {
          include: {
            items: {
              include: { menuItem: true },
            },
            table: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = bills
      .filter((b) => b.paymentStatus === 'PAID')
      .reduce((acc, curr) => acc + curr.grandTotal, 0);

    const pendingAmount = bills
      .filter((b) => b.paymentStatus === 'PENDING')
      .reduce((acc, curr) => acc + curr.grandTotal, 0);

    return NextResponse.json({
      bills,
      totalRevenue,
      pendingAmount,
      totalCount: bills.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
