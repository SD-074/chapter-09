import { Post } from '#models';
import type { RequestHandler } from 'express';

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
export const getPostById: RequestHandler = async (req, res) => {};
export const createPost: RequestHandler = async (req, res) => {};
export const updatePost: RequestHandler = async (req, res) => {};
export const deletePost: RequestHandler = async (req, res) => {};
