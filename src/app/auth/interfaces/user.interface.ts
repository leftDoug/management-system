export interface User {
  id: string;
  FK_idWorker: string;
  username: string;
  password: string;
  admin: boolean;
}

export interface TestUser {
  id: number;
  username: string;
}

export interface UserLogin {
  username: string;
  password: string;
}
