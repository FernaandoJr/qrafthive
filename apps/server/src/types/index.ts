export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthContext extends Record<string, unknown> {
  user: User | null;
  session: any;
}