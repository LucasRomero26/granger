import bcryptjs from 'bcryptjs'

const BCRYPT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, BCRYPT_ROUNDS)
}

export async function checkPassword(enteredPassword: string, storedHash: string): Promise<boolean> {
  return bcryptjs.compare(enteredPassword, storedHash)
}
