import { Worker } from 'src/app/auth/interfaces/user.interface';

export interface Organization {
  id: string;
  name: string;
  leader?: Worker;
  idLeader?: string;
}
