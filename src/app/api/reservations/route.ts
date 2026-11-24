import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      date,
      time,
      guests = 2,
      zone = 'Main Dining',
      specialRequests = '',
    } = body;

    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Name, phone, date, and time are required for table reservation' },
        { status: 400 }
      );
    }

    // Try to find an available table in the requested zone
    let table = await prisma.restaurantTable.findFirst({
      where: {
        floorZone: zone,
        status: 'AVAILABLE',
      },
    });

    // If not found in zone, find any available table
    if (!table) {
      table = await prisma.restaurantTable.findFirst({
        where: {
          status: 'AVAILABLE',
        },
      });
    }

    // If a table is found, reserve it
    if (table) {
      await prisma.restaurantTable.update({
        where: { id: table.id },
        data: { status: 'RESERVED' },
      });
    }

    // Record the reservation as an inquiry message so Admin can track it
    const reservationCode = `RSG-RES-${Math.floor(10000 + Math.random() * 90000)}`;
    const messageContent = `Table Reservation Request [${reservationCode}]
Guest: ${name}
Phone: ${phone}
Email: ${email || 'N/A'}
Date: ${date} at ${time}
Party Size: ${guests} Guests
Floor Zone: ${zone}
Assigned Table: ${table ? table.tableNumber : 'Pending Host Assignment'}
Special Requests: ${specialRequests || 'None'}`;

    await prisma.message.create({
      data: {
        name,
        email: email || `${phone.replace(/\D/g, '')}@guest.johnsonfoodcourt.com`,
        phone,
        subject: `Table Reservation: ${guests} Guests on ${date} (${time})`,
        message: messageContent,
        status: 'UNREAD',
      },
    });

    return NextResponse.json({
      success: true,
      reservationCode,
      tableNumber: table ? table.tableNumber : null,
      message: 'Table reservation successfully confirmed',
    });
  } catch (error: any) {
    console.error('Reservation API error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
