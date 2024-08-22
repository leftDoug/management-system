export interface Meeting {
  id: string;
  FK_idTypeOfMeeting: string;
  FK_idResponsible: string;
  name: string;
  session: Session;
  date: Date;
  endTime: Date;
  startTime: Date;
}

export interface MeetingWithArea {
  id: string;
  typeOfMeeting: string;
  area: string;
  name: string;
  session: string;
  date: Date;
}

export enum Session {
  ordinary = 'Ordinaria',
  extraordinary = 'Extraordinaria',
}
