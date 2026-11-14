import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tableId = searchParams.get('tableId');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (tableId) {
      where.tableId = tableId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
        bill: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tableId,
      customerName,
      customerPhone,
      orderType = 'DINE_IN',
      specialInstructions,
      items, // array of { menuItemId, quantity, specialInstructions }
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Generate unique order number: ORD-XXXX
    const count = await prisma.order.count();
    const orderNumber = `ORD-${1000 + count + 1}`;

    // Calculate subtotal
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: items.map((i: any) => i.menuItemId) } },
    });
    const itemMap = new Map(menuItems.map((m) => [m.id, m]));

    let subtotal = 0;
    const orderItemsData = items.map((i: any) => {
      const dish = itemMap.get(i.menuItemId);
      const unitPrice = dish ? dish.price : 0;
      const totalPrice = unitPrice * (i.quantity || 1);
      subtotal += totalPrice;

      return {
        menuItemId: i.menuItemId,
        quantity: i.quantity || 1,
        unitPrice,
        totalPrice,
        specialInstructions: i.specialInstructions || null,
        status: 'PENDING',
      };
    });

    // 5% GST tax
    const taxAmount = +(subtotal * 0.05).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        tableId: tableId || null,
        customerName: customerName || 'Guest Diner',
        customerPhone: customerPhone || null,
        orderType,
        status: 'PENDING',
        specialInstructions: specialInstructions || null,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Order placed by customer/waiter',
            changedBy: customerName || 'Customer',
          },
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // If table assigned, mark table as OCCUPIED
    if (tableId) {
      await prisma.restaurantTable.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });
    }

    return NextResponse.json({ order, message: 'Order created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, changedBy = 'Chef / Staff', notes } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and new status are required' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: notes || `Status updated to ${status}`,
            changedBy,
          },
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({ order, message: `Order updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
