import { Router } from 'express';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost
} from '#controllers';
import { validateBody } from '#middleware';
import { blogPostInputSchema } from '#schemas';

const blogPostRoutes = Router();

blogPostRoutes
  .route('/')
  .get(getAllBlogPosts)
  .post(validateBody(blogPostInputSchema), createBlogPost);
blogPostRoutes
  .route('/:id')
  .get(getBlogPostById)
  .put(validateBody(blogPostInputSchema), updateBlogPost)
  .delete(deleteBlogPost);

export default blogPostRoutes;
