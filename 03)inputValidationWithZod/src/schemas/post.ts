import { z } from 'zod';
export const postSchema = z.object({
  title: z.string('Title must be a string').min(1, 'Title is required'),
  content: z.string('Content must be a string').min(1, 'Content is required'),
  userId: z.string('User ID must be a string').min(1, 'User ID is required')
});
