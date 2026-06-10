import { z } from 'zod/v4';

export const PostInputSchema = z.strictObject({
  title: z.string({ error: 'Title must be a string' }).min(1, {
    message: 'Title is required',
  }),
  content: z.string({ error: 'Content must be a string' }).min(1, {
    message: 'Content is required',
  }),
});
