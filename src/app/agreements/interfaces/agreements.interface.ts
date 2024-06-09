export interface Agreement {
  id: string;
  number: number;
  area: string;
  meeting: string;
  session: string;
  createdBy: string;
  meetingDate: Date;
  meetingStartTime: Date;
  meetingEndTime: Date;
  agreementCompilanceDate: Date;
  solution: string;
  // fulfilled: boolean;
  status: string;
  // TODO: agregar contenido y encargado
}
