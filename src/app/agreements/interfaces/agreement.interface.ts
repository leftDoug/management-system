import { Worker } from 'src/app/auth/interfaces/user.interface';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';

export interface Agreement {
  id: string;
  number?: number;
  content: string;
  state?: boolean;
  compilanceDate: Date;
  completed?: boolean;
  status?: Status;
  meeting?: Meeting;
  responsible?: Worker;
  idMeeting?: string;
  idResponsible?: string;
}

export interface Response {
  id: number;
  content: string;
}

// export interface AgreementWithStatus {
//   id: string;
//   content: string;
//   meeting: string;
//   number: number;
//   responsible: string;
//   status: Status;
// }

export enum Status {
  canceled = 'ANULADO',
  fulfilled = 'CUMPLIDO',
  inProcess = 'EN PROCESO',
  unfulfilled = 'INCUMPLIDO',
}
