import { type RequestHandler } from 'express';
import { User } from '#models';
import type { userSchema } from '#schemas';
import { z } from 'zod/v4';
import { Types } from 'mongoose';
import id from 'zod/v4/locales/id.js';
type UserInputDTO = z.infer<typeof userSchema>;
type UserDTO = {
  _id: InstanceType<typeof Types.ObjectId>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type ErrorResponse = {
  message: string;
};
export const getUsers: RequestHandler<unknown, UserDTO[] | ErrorResponse> = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const createUser: RequestHandler<unknown, UserDTO | ErrorResponse, UserInputDTO> = async (req, res) => {
  try {
    const found = await User.findOne({ email: req.body.email });
    if (found) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ ...req.body } satisfies UserInputDTO);
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getUserById: RequestHandler<{ id: string }, UserDTO | ErrorResponse> = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateUser: RequestHandler<{ id: string }, UserDTO | ErrorResponse, UserInputDTO> = async (req, res) => {
  try {
    const {
      body,
      params: { id }
    } = req;

    const user = await User.findByIdAndUpdate(id, body, {
      new: true
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deleteUser: RequestHandler<{ id: string }, { message: string }, unknown> = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
