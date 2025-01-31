import { Role } from './role.interface';
import { User, UserResponse } from './user.interface';

export interface AuthResponse {
  ok: boolean;
  id?: string;
  idWorker?: string;
  idArea?: string;
  token?: string;
  msg?: string;
  arg?: User[] | Role[] | Role | UserResponse[];
}
