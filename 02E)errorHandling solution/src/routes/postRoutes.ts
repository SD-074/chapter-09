import { Router } from 'express';
import { createPost, deletePost, getPosts, getPostById, updatePost } from '#controllers';

const postRoutes = Router();

postRoutes.route('/').get(getPosts).post(createPost);

postRoutes.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

export default postRoutes;
