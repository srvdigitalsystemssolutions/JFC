import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const modules = [
      'DASHBOARD',
      'ANALYTICS',
      'MENU',
      'MENU_MASTER',
      'BILLING',
      'TABLES',
      'GALLERY',
      'TESTIMONIALS',
      'MESSAGES',
      'SETTINGS',
      'RBAC',
      'USERS',
    ];

    return NextResponse.json({ roles, modules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const formattedName = name.toUpperCase().replace(/\s+/g, '_');

    const role = await prisma.role.create({
      data: {
        name: formattedName,
        description: description || '',
      },
    });

    // Initialize default permissions for all modules
    const modules = [
      'DASHBOARD',
      'ANALYTICS',
      'MENU',
      'MENU_MASTER',
      'BILLING',
      'TABLES',
      'GALLERY',
      'TESTIMONIALS',
      'MESSAGES',
      'SETTINGS',
      'RBAC',
      'USERS',
    ];

    for (const mod of modules) {
      await prisma.permission.create({
        data: {
          roleId: role.id,
          module: mod,
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
        },
      });
    }

    const fullRole = await prisma.role.findUnique({
      where: { id: role.id },
      include: { permissions: true },
    });

    return NextResponse.json({ role: fullRole, message: 'Role created with base permissions' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { roleId, permissions } = await request.json();

    if (!roleId || !Array.isArray(permissions)) {
      return NextResponse.json({ error: 'Role ID and permissions array required' }, { status: 400 });
    }

    for (const p of permissions) {
      await prisma.permission.upsert({
        where: {
          roleId_module: {
            roleId,
            module: p.module,
          },
        },
        update: {
          canCreate: Boolean(p.canCreate),
          canRead: Boolean(p.canRead),
          canUpdate: Boolean(p.canUpdate),
          canDelete: Boolean(p.canDelete),
        },
        create: {
          roleId,
          module: p.module,
          canCreate: Boolean(p.canCreate),
          canRead: Boolean(p.canRead),
          canUpdate: Boolean(p.canUpdate),
          canDelete: Boolean(p.canDelete),
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Permissions updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
