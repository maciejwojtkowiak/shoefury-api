import { Multer } from 'multer';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_KEY: string;
      SECRET_KEY: string;
      STRIPE_KEY: string;
    }
  }
}

interface Error {
  status?: number;
}

declare module 'http' {
  interface IncomingHttpHeaders {
    Authorization?: string;
  }
}

declare global {
  interface PathParams extends Multer {}
}

declare global {
  namespace Express {
    export interface Request {
      body: {
        userId?: string;
      }
    }
  }
}
export {};
