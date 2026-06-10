import { Post } from '#models';
import type { RequestHandler } from 'express';
import type { Types } from 'mongoose';
import { PostInputSchema } from '#schemas';
import type { z } from 'zod/v4';
export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};
export const getPostById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
type PostInputDTO = z.infer<typeof PostInputSchema>;
type PostDTO = PostInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
};
type ErrorResponse = { message: string };

export const createPost: RequestHandler<unknown, PostDTO | ErrorResponse, PostInputDTO> = async (
  req,
  res,
) => {
  try {
    const post = await Post.create({ ...req.body } satisfies PostInputDTO);
    res.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updatePost: RequestHandler = async (req, res) => {
  try {
    const {
      body: { title, content, userId },
      params: { id },
    } = req;
    if (!title || !content || !userId)
      return res.status(400).json({ error: 'title, content, and userId are required' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.title = title;
    post.content = content;
    await post.save();

    const populatedPost = await post.populate('userId', 'firstName lastName email');
    res.json(populatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
