import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { verifyOtp, storeOtp } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, otp, action } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Action: Resend OTP
    if (action === 'resend') {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user || user.role.name !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'User not eligible for admin 2FA' }, { status: 400 });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      storeOtp(user.email, newOtp, 300);

      console.log(`[2FA RESEND] New Admin Code for ${user.email}: ${newOtp}`);

      return NextResponse.json({
        success: true,
        previewOtp: newOtp,
        message: `New verification code dispatched to ${user.email}`,
      });
    }

    // Verify OTP
    if (!otp) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const isValid = verifyOtp(email, otp);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired 6-digit verification code. Please check your email.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.status !== 'ACTIVE' || user.role.name !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
