'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerUserService } from 'data/services/auth-service';

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
  // Don't set domain explicitly; let Next infer from current host
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: 'Username must be between 3 and 20 characters',
  }),
  password: z.string().min(6).max(100, {
    message: 'Password must be between 6 and 100 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});

export async function registerUserAction(prevState: any) {
  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    message: 'Registration is disabled. Contact an administrator.',
  };
}
