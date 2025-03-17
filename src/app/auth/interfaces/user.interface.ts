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

// FIXME cambiar el id a number
export interface WorkerResponse {
  id: string;
  name: string;
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
