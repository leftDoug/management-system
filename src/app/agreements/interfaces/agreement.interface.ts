export interface Agreement {
  id: string;
  FK_idArea: string;
  FK_idCreatedBy: string;
  FK_idMeeting: string;
  FK_idResponsible: string;
  FK_idSession: string;
  answer: string;
  canceled: boolean;
  compilanceDate: Date;
  completed: boolean;
  content: string;
  meetingDate: Date;
  meetingEndTime: Date;
  meetingStartTime: Date;
  number: number;
}

export interface AgreementWithStatus {
  id: string;
  area: string;
  content: string;
  meeting: string;
  meetingDate: Date;
  number: number;
  responsible: string;
  session: string;
  status: Status;
}

export enum Status {
  canceled = 'ANULADO',
  fulfilled = 'CUMPLIDO',
  inProcess = 'EN PROCESO',
  unfulfilled = 'INCUMPLIDO',
}
