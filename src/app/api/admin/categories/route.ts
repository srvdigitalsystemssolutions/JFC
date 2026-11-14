import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, image, displayOrder, isActive } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        displayOrder: parseInt(displayOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ category, message: 'Category created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, image, displayOrder, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ category, message: 'Category updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
