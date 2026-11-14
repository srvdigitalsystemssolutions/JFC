import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      discountType = 'NONE',
      discountValue = 0,
      paymentMethod = 'CASH',
      transactionRef = null,
    } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Subtotal
    const subtotal = order.subtotal;

    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'PERCENT') {
      discountAmount = +(subtotal * (discountValue / 100)).toFixed(2);
    } else if (discountType === 'FIXED') {
      discountAmount = Math.min(discountValue, subtotal);
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxRate = 5.0; // 5% GST
    const taxAmount = +(taxableAmount * (taxRate / 100)).toFixed(2);
    const grandTotal = +(taxableAmount + taxAmount).toFixed(2);

    // Generate Invoice Number: INV-YYYY-XXX
    const year = new Date().getFullYear();
    const billCount = await prisma.bill.count();
    const invoiceNumber = `INV-${year}-${String(billCount + 1).padStart(3, '0')}`;

    // Create or update Bill
    const bill = await prisma.bill.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        tableId: order.tableId,
        subtotal,
        taxRate,
        taxAmount,
        discountType,
        discountValue,
        discountAmount,
        grandTotal,
        paymentStatus: 'PAID',
        payments: {
          create: {
            amount: grandTotal,
            paymentMethod,
            transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
            status: 'COMPLETED',
          },
        },
      },
      include: {
        payments: true,
        order: {
          include: {
            table: true,
            items: { include: { menuItem: true } },
          },
        },
      },
    });

    // Update Order to COMPLETED
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        discountAmount,
        taxAmount,
        totalAmount: grandTotal,
        statusHistory: {
          create: {
            status: 'COMPLETED',
            notes: `Paid & settled via ${paymentMethod}. Invoice ${invoiceNumber}`,
            changedBy: 'POS Staff',
          },
        },
      },
    });

    // Free the table back to AVAILABLE
    if (order.tableId) {
      await prisma.restaurantTable.update({
        where: { id: order.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    return NextResponse.json({
      bill,
      message: 'Checkout complete and invoice generated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
