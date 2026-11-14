import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { category: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, category, imageUrl, description, isFeatured, displayOrder } = await request.json();

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: {
        title,
        category: category || 'Ambience',
        imageUrl,
        description: description || '',
        isFeatured: Boolean(isFeatured),
        displayOrder: parseInt(displayOrder) || 0,
      },
    });

    return NextResponse.json({ item, message: 'Image added to gallery' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, category, imageUrl, description, isFeatured, displayOrder } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (description !== undefined) updateData.description = description;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);

    const item = await prisma.gallery.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ item, message: 'Gallery item updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    await prisma.gallery.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Image deleted from gallery' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
