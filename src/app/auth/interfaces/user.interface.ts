export interface User {
  id: string;
  idWorker: string;
  idRole: string;
  username: string;
  password: string;
  state: boolean;
}

export interface UserResponse {
  username: string;
  worker: string;
  role: string;
}

export interface UserLogged {
  id: string;
  idWorker: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

// export interface testUser {
//   username: string;
//   idWorker: number;
//   password: string;
// }
