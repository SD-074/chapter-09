import http, { type RequestListener, type IncomingMessage, type ServerResponse } from 'node:http';
import { isValidObjectId } from 'mongoose';
import { connectToDatabase } from '#db';
import { Post, type PostInputType } from '#models';

const createResponse = (res: ServerResponse, statusCode: number, message: unknown) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  return res.end(
    typeof message === 'string' ? JSON.stringify({ message }) : JSON.stringify(message),
  );
};

const parseJsonBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as T);
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

const isPostInputType = (value: unknown): value is PostInputType => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const maybePost = value as { title?: unknown; content?: unknown };

  return (
    typeof maybePost.title === 'string' &&
    maybePost.title.trim().length > 0 &&
    typeof maybePost.content === 'string' &&
    maybePost.content.trim().length > 0
  );
};

const getSinglePostIdFromUrl = (url: string): string | null => {
  const pathname = url.split('?')[0] ?? '';

  if (!pathname.startsWith('/posts/')) {
    return null;
  }

  const parts = pathname.split('/');

  if (parts.length !== 3) {
    return null;
  }

  const resourceId = parts[2] ?? '';

  return resourceId.length > 0 ? resourceId : null;
};

const requestHandler: RequestListener = async (req, res) => {
  try {
    const method = req.method ?? '';
    const url = req.url ?? '';

    if (url === '/posts') {
      if (method === 'GET') {
        const posts = await Post.find().sort({ createdAt: -1 });
        return createResponse(res, 200, posts);
      }

      if (method === 'POST') {
        const parsedBody = await parseJsonBody<unknown>(req);

        if (!isPostInputType(parsedBody)) {
          return createResponse(
            res,
            400,
            'Invalid post payload. Expected title and content strings.',
          );
        }

        const createdPost = await Post.create({
          title: parsedBody.title.trim(),
          content: parsedBody.content.trim(),
        });

        return createResponse(res, 201, createdPost);
      }

      return createResponse(res, 405, 'Method Not Allowed');
    }

    const postId = getSinglePostIdFromUrl(url);

    if (postId !== null) {
      if (!isValidObjectId(postId)) {
        return createResponse(res, 400, 'Invalid post id format.');
      }

      if (method === 'GET') {
        const post = await Post.findById(postId);

        if (!post) {
          return createResponse(res, 404, 'Post not found.');
        }

        return createResponse(res, 200, post);
      }

      if (method === 'PUT') {
        const parsedBody = await parseJsonBody<unknown>(req);

        if (!isPostInputType(parsedBody)) {
          return createResponse(
            res,
            400,
            'Invalid post payload. Expected title and content strings.',
          );
        }

        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            title: parsedBody.title.trim(),
            content: parsedBody.content.trim(),
          },
          {
            new: true,
            runValidators: true,
          },
        );

        if (!updatedPost) {
          return createResponse(res, 404, 'Post not found.');
        }

        return createResponse(res, 200, updatedPost);
      }

      if (method === 'DELETE') {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
          return createResponse(res, 404, 'Post not found.');
        }

        return createResponse(res, 200, { message: 'Post deleted successfully.' });
      }

      return createResponse(res, 405, 'Method Not Allowed');
    }

    return createResponse(res, 404, 'Not Found');
  } catch (error) {
    console.error('Request processing failed:', error);
    return createResponse(res, 500, 'Internal Server Error');
  }
};

await connectToDatabase();

const server = http.createServer(requestHandler);

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
