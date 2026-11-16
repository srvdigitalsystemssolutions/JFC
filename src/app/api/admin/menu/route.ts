import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const isVeg = searchParams.get('isVeg');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    if (isVeg !== null && isVeg !== undefined && isVeg !== 'all') {
      where.isVeg = isVeg === 'true';
    }

    const items = await prisma.menuItem.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items, menuItems: items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, isVeg, isAvailable, image, tags, prepTime } = body;

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const item = await prisma.menuItem.create({
      data: {
        name,
        slug,
        description: description || '',
        price: parseFloat(price),
        categoryId,
        isVeg: Boolean(isVeg),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        tags: tags || '',
        prepTime: parseInt(prepTime) || 15,
      },
      include: { category: true },
    });

    return NextResponse.json({ item, message: 'Menu item created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, categoryId, isVeg, isAvailable, image, tags, prepTime } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isVeg !== undefined) updateData.isVeg = Boolean(isVeg);
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);
    if (image !== undefined) updateData.image = image;
    if (tags !== undefined) updateData.tags = tags;
    if (prepTime !== undefined) updateData.prepTime = parseInt(prepTime);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({ item: updated, message: 'Menu item updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
