import * as crypto from 'node:crypto';
export const generateOtp = (length: number = 6): string => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};
