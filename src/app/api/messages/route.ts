import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Dining Inquiry',
        message,
        status: 'UNREAD',
      },
    });

    return NextResponse.json({ message: 'Thank you! Your message has been received.', data: savedMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
