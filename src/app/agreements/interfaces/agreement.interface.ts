export interface Agreement {
  id: string;
  number: number;
  content: string;
  workArea: string;
  meeting: string;
  meetingDate: Date;
  meetingStartTime: Date;
  meetingEndTime: Date;
  session: string;
  createdBy: string;
  responsible: string;
  agreementCompilanceDate: Date;
  answer: string;
  status: Status;
}

export enum Status {
  cumplido = 'cumplido',
  en_proceso = 'en proceso',
  incumplido = 'incumplido',
  anulado = 'anulado',
}
