export interface IUser {
  name: string;
  email: string;
  age?: number | null;
  password: string;
  role?: string;
}
