import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '#controllers';
import { Router } from 'express';

const postRouter = Router();
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

export default postRouter;
