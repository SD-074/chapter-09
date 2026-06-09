declare global {
  namespace Express {
    export interface Request {
      user?: { name: string; id: number; email: string };
    }
  }
}
// This empty export makes the file a module, allowing declare global to work properly
export {};
