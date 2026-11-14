import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.setting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.setting.create({
        data: {
          id: 'default',
          restaurantName: 'Royal Spice Grand Restaurant & Bar',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantName,
      tagLine,
      logo,
      address,
      phone,
      email,
      openingHours,
      currency,
      currencySymbol,
      taxRate,
      taxNumber,
      websiteUrl,
      facebookUrl,
      instagramUrl,
      twitterUrl,
    } = body;

    const updated = await prisma.setting.upsert({
      where: { id: 'default' },
      update: {
        restaurantName,
        tagLine,
        logo,
        address,
        phone,
        email,
        openingHours,
        currency,
        currencySymbol,
        taxRate: parseFloat(taxRate) || 5.0,
        taxNumber,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        twitterUrl,
      },
      create: {
        id: 'default',
        restaurantName: restaurantName || 'Royal Spice',
        taxRate: parseFloat(taxRate) || 5.0,
      },
    });

    return NextResponse.json({ settings: updated, message: 'Settings saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
