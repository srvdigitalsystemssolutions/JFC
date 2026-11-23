// In-memory 2FA OTP Store for Administrator Login

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const otpMap = new Map<string, OtpEntry>();

export function storeOtp(email: string, otp: string, ttlSeconds = 300): void {
  const normalized = email.toLowerCase().trim();
  otpMap.set(normalized, {
    otp,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function verifyOtp(email: string, enteredOtp: string): boolean {
  const normalized = email.toLowerCase().trim();
  const entry = otpMap.get(normalized);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(normalized);
    return false;
  }

  if (entry.otp === enteredOtp.trim()) {
    otpMap.delete(normalized); // One-time use
    return true;
  }

  return false;
}
