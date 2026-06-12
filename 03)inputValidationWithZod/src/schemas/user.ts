import { z } from 'zod';
export const userSchema = z.object({
  firstName: z.string('First name must be a string').min(1, 'First name is required'),
  lastName: z.string('Last name must be a string').min(1, 'Last name is required'),
  email: z.string('Email must be a string').email('Invalid email format').min(1, 'Email is required'),
  password: z.string('Password must be a string').min(6, 'Password must be at least 6 characters long').optional()
});
