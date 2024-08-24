export interface Agreement {
  id: string;
  FK_idCreatedBy: string;
  FK_idMeeting: string;
  FK_idResponsible: string;
  answer: string;
  canceled: boolean;
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
