import { Schema, model, type InferSchemaType } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

type PostType = InferSchemaType<typeof postSchema>;

export type PostInputType = Pick<PostType, 'title' | 'content'>;

export const Post = model<PostType>('Post', postSchema);
