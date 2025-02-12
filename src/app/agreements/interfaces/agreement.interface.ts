export interface Agreement {
  id: string;
  meeting?: string;
  responsible?: string;
  idMeeting?: string;
  idResponsible?: string;
  state: boolean;
  compilanceDate: Date;
  completed: boolean;
  content: string;
  number: number;
}

export interface AgreementWithStatus {
  id: string;
  content: string;
  meeting: string;
  number: number;
  responsible: string;
  status: Status;
}

export enum Status {
  canceled = 'ANULADO',
  fulfilled = 'CUMPLIDO',
  inProcess = 'EN PROCESO',
  unfulfilled = 'INCUMPLIDO',
}
