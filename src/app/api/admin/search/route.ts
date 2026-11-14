import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q || q.length < 2) {
      return NextResponse.json({
        core: { menuItems: [], categories: [], tables: [], bills: [], orders: [] },
        content: { gallery: [], testimonials: [], messages: [] },
        admin: { users: [], roles: [] },
        totalCount: 0,
      });
    }

    const [
      // CORE MANAGEMENT
      menuItems,
      categories,
      tables,
      bills,
      orders,

      // CONTENT & INQUIRIES
      gallery,
      testimonials,
      messages,

      // ADMINISTRATION & STAFF
      users,
      roles,
    ] = await Promise.all([
      // 1. Menu Items
      prisma.menuItem.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q } },
            { category: { name: { contains: q } } },
          ],
        },
        include: { category: true },
        take: 4,
      }),

      // 2. Categories
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        include: {
          _count: { select: { menuItems: true } },
        },
        take: 4,
      }),

      // 3. Dining Tables
      prisma.restaurantTable.findMany({
        where: {
          OR: [
            { tableNumber: { contains: q } },
            { floorZone: { contains: q } },
            { status: { contains: q } },
          ],
        },
        take: 4,
      }),

      // 4. Bills
      prisma.bill.findMany({
        where: {
          OR: [
            { invoiceNumber: { contains: q } },
            { order: { customerName: { contains: q } } },
            { paymentStatus: { contains: q } },
          ],
        },
        include: { order: true },
        take: 4,
      }),

      // 5. Orders
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q } },
            { customerName: { contains: q } },
            { status: { contains: q } },
          ],
        },
        include: { table: true },
        take: 4,
      }),

      // 6. Gallery
      prisma.gallery.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { category: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 4,
      }),

      // 7. Testimonials
      prisma.testimonial.findMany({
        where: {
          OR: [
            { customerName: { contains: q } },
            { customerRole: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 4,
      }),

      // 8. Messages & Leads
      prisma.message.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { subject: { contains: q } },
            { message: { contains: q } },
          ],
        },
        take: 4,
      }),

      // 9. Users & Staff
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { role: { name: { contains: q } } },
          ],
        },
        include: { role: true },
        take: 4,
      }),

      // 10. RBAC Roles
      prisma.role.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: {
          _count: { select: { users: true } },
        },
        take: 4,
      }),
    ]);

    const safeUsers = users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });

    const coreCount = menuItems.length + categories.length + tables.length + bills.length + orders.length;
    const contentCount = gallery.length + testimonials.length + messages.length;
    const adminCount = safeUsers.length + roles.length;
    const totalCount = coreCount + contentCount + adminCount;

    return NextResponse.json({
      query: q,
      core: {
        menuItems,
        categories,
        tables,
        bills,
        orders,
        count: coreCount,
      },
      content: {
        gallery,
        testimonials,
        messages,
        count: contentCount,
      },
      admin: {
        users: safeUsers,
        roles,
        count: adminCount,
      },
      totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
