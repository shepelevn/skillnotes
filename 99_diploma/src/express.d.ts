declare namespace Express {
  export interface Request {
    user: import("./auth/User");
  }
}
