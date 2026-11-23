import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';
import { storeOtp } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your account is deactivated. Contact Administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Two-step verification requirement:
    // Only SUPER_ADMIN requires 2-step email verification.
    // Chef, Billing Staff, and Waiter / Floor Staff log in directly with employee email and password.
    if (user.role.name === 'SUPER_ADMIN') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      storeOtp(user.email, otp, 300);

      console.log(`[ADMIN 2FA EMAIL DISPATCH] 6-digit verification code for ${user.email}: ${otp}`);

      return NextResponse.json({
        requires2FA: true,
        email: user.email,
        previewOtp: otp,
        message: `A two-step verification code has been dispatched to ${user.email}.`,
      });
    }

    // Direct login for Chef, Billing, and Waiter / Staff
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      requires2FA: false,
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
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
