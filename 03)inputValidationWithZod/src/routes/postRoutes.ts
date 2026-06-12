import { Router } from 'express';
import { createPost, deletePost, getPosts, getPostById, updatePost } from '#controllers';
import { validateBody } from '#middleware';
import { postSchema } from '#schemas';
const postRoutes = Router();

postRoutes.route('/').get(getPosts).post(validateBody(postSchema), createPost);

postRoutes.route('/:id').get(getPostById).put(validateBody(postSchema), updatePost).delete(deletePost);

export default postRoutes;
