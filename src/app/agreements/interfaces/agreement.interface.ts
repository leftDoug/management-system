export interface Agreement {
  id: string;
  meeting?: string;
  responsible?: string;
  meeting_id?: string;
  responsible_id?: string;
  state: boolean;
  compilance_date: Date;
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
