import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    username: string;
  }

  interface User {
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
  }
}
