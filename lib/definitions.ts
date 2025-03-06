import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginFormState =
| {
    errors?: {
      email?: string[]
      password?: string[]
    }
    message?: string
  }
| undefined