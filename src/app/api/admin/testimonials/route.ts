import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerRole: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customerName, customerRole, avatarUrl, rating, content, isApproved } = await request.json();

    if (!customerName || !content) {
      return NextResponse.json({ error: 'Customer name and feedback content are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        customerRole: customerRole || 'Guest Diner',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: parseInt(rating) || 5,
        content,
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      },
    });

    return NextResponse.json({ testimonial, message: 'Testimonial added successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, customerName, customerRole, avatarUrl, rating, content, isApproved } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerRole !== undefined) updateData.customerRole = customerRole;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (content !== undefined) updateData.content = content;
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ testimonial, message: 'Testimonial updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
