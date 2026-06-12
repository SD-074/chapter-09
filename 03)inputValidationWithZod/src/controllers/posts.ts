import { type RequestHandler } from 'express';
import { Post } from '#models';
import type { postSchema } from '#schemas';
import { z } from 'zod/v4';
import { Types } from 'mongoose';

type PostInputDTO = z.infer<typeof postSchema>;
type PostDTO = {
  _id: InstanceType<typeof Types.ObjectId>;
  title: string;
  content: string;
  user: {
    _id: InstanceType<typeof Types.ObjectId>;
    firstName: string;
    lastName: string;
    email: string;
  };
  userId: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
type ErrorResponse = {
  message: string;
};
export const getPosts: RequestHandler<unknown, PostDTO[] | ErrorResponse> = async (req, res) => {
  try {
    const posts = (await Post.find().populate('user', 'firstName lastName email').lean()) as PostDTO[];
    res.json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const createPost: RequestHandler<unknown, PostDTO | ErrorResponse, PostInputDTO> = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body } satisfies PostInputDTO);
    const populatedPost = (await post.populate('user', 'firstName lastName email')).toObject({
      virtuals: true
    }) as PostDTO;
    res.json(populatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getPostById: RequestHandler<{ id: string }, PostDTO | ErrorResponse> = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const post = (await Post.findById(id).populate('user', 'firstName lastName email')) as PostDTO | null;
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updatePost: RequestHandler<{ id: string }, PostDTO | ErrorResponse, PostInputDTO> = async (req, res) => {
  try {
    const updatedPost = (await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
      .lean()
      .populate('user', 'firstName lastName email')) as PostDTO | null;
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deletePost: RequestHandler<{ id: string }, {}, ErrorResponse> = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
