import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '#controllers';
import { Router } from 'express';
import { validateBody } from '#middleware';
import { PostInputSchema } from '#schemas';
const postRouter = Router();
postRouter.use((req, res, next) => {
  console.log('this is router specific middleware');
  next();
});
postRouter.get(
  '/',
  (req, res, next) => {
    console.log('this is route specific middleware', req.user);
    next();
  },
  getAllPosts,
);
postRouter.get('/:id', getPostById);
postRouter.post('/', validateBody(PostInputSchema), createPost);
postRouter.put('/:id', validateBody(PostInputSchema), updatePost);
postRouter.delete('/:id', deletePost);

export default postRouter;
