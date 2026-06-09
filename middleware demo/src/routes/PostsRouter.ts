import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '#controllers';
import { Router } from 'express';

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
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

export default postRouter;
