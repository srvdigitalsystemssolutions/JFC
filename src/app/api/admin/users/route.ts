import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const roleId = searchParams.get('roleId') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { role: { name: { contains: search } } },
      ];
    }
    if (roleId && roleId !== 'ALL') {
      where.roleId = roleId;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeUsers = users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ users: safeUsers, roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, roleId, phone, status, avatar } = body;

    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: 'Name, email, password and role are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        phone: phone || '',
        status: status || 'ACTIVE',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      },
      include: { role: true },
    });

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, message: 'User created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, password, roleId, phone, status, avatar } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password && password.trim() !== '') {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    const { password: _, ...safeUser } = updated;
    return NextResponse.json({ user: safeUser, message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (user?.role.name === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: { name: 'SUPER_ADMIN' } },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the only Super Admin user' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
