export interface Agreement {
  PK_id: string;
  FK_idArea: string;
  FK_idResponsible: string;
  FK_idCreatedBy: string;
  FK_idMeeting: string;
  FK_idSession: string;
  number: number;
  content: string;
  compilanceDate: Date;
  meetingDate: Date;
  meetingStartTime: Date;
  meetingEndTime: Date;
  completed: boolean;
  canceled: boolean;
  answer: string;
}

export interface AgreementWithStatus {
  PK_id: string;
  number: number;
  content: string;
  area: string;
  responsible: string;
  meeting: string;
  session: string;
  meetingDate: Date;
  status: Status;
}

export enum Status {
  fulfilled = 'cumplido',
  inProcess = 'en proceso',
  unfulfilled = 'incumplido',
  canceled = 'anulado',
}
