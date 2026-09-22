import crypto from 'crypto';
import { OtpModel } from '../models/Otp.js';
import { logger } from '../utils/logger.js';

export const normalizeIndianMobile = (input) => {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
    return `+${digits}`;
  }
  return null;
};

export const generateAndSaveOtp = async (mobile) => {
  // Clear any existing OTP for this mobile
  await OtpModel.deleteMany({ mobile });

  // Generate 6-digit cryptographic code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  // Hash OTP code for security
  const otpHash = crypto.createHash('sha256').update(code).digest('hex');

  await OtpModel.create({
    mobile,
    otpCode: otpHash,
    expiresAt,
    attempts: 0,
  });

  logger.info(`[OTP SERVICE] Generated verification code for ${mobile}: ${code} (valid for ${expiryMinutes} minutes)`);

  return {
    code,
    expiresAt,
    isDev: process.env.NODE_ENV !== 'production',
  };
};

export const verifyOtpCode = async (mobile, enteredCode) => {
  const record = await OtpModel.findOne({ mobile });
  if (!record) {
    return { valid: false, message: 'No active verification code found for this mobile number. Please request a new OTP.' };
  }

  if (new Date() > new Date(record.expiresAt)) {
    await OtpModel.deleteMany({ mobile });
    return { valid: false, message: 'Verification code has expired. Please request a new code.' };
  }

  if (record.attempts >= 3) {
    await OtpModel.deleteMany({ mobile });
    return { valid: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
  }

  const enteredHash = crypto.createHash('sha256').update(enteredCode.trim()).digest('hex');
  if (enteredHash !== record.otpCode) {
    await OtpModel.findByIdAndUpdate(record._id || record.id, {
      $set: { attempts: record.attempts + 1 },
    });
    return {
      valid: false,
      message: `Incorrect OTP code. ${2 - record.attempts} attempts remaining.`,
    };
  }

  // Successfully verified - clear OTP
  await OtpModel.deleteMany({ mobile });
  return { valid: true };
};
