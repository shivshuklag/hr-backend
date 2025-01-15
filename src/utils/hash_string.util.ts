import * as bcrypt from 'bcrypt';

export async function generateHash(
  str: string,
  saltRounds: number = 10,
): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(str, salt);
}
