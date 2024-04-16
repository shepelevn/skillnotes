import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function hash(input: string): string {
  return bcrypt.hashSync(input, SALT_ROUNDS);
}

export function compare(raw: string, hash: string): boolean {
  return bcrypt.compareSync(raw, hash);
}
