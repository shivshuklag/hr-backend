import * as bcrypt from 'bcrypt';

export async function verifyHash(str: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(str, hash);
}
