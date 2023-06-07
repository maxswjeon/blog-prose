declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;

      TOKEN_SECRET: string;
    }
  }
}

export {};
