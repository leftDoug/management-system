export interface Meeting {
  id: string;
  idTypeOfMeeting: string;
  idSecretary: string;
  name: string;
  session: Session;
  date: Date;
  endTime: Date;
  startTime: Date;
  state: boolean;
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
