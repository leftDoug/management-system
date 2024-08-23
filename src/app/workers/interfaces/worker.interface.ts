export interface Worker {
  id: string;
  FK_idWorkArea: string;
  name: string;
}

export interface WorkerX {
  id: string;
  name: string;
  occupation: string;
  email: string;
  secretary: boolean;
}
