import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { customerName, customerRole, avatarUrl, rating, content } = await request.json();

    if (!customerName || !content) {
      return NextResponse.json({ error: 'Name and review content are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        customerRole: customerRole || 'Guest Diner',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: parseInt(rating) || 5,
        content,
        isApproved: true, // Auto-approved for demonstration, can be unapproved in Super Admin
      },
    });

    return NextResponse.json({ testimonial, message: 'Thank you! Your review has been submitted.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
