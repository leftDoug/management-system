import { Worker } from 'src/app/auth/interfaces/user.interface';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';

export interface Meeting {
  id: string;
  name: string;
  session: Session | string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  typeOfMeeting?: TypeOfMeeting;
  secretary?: Worker;
  idTypeOfMeeting?: string;
  idSecretary?: string;
  organization?: Organization;
  participants?: Worker[] | string[];
  members?: string[];
  guests?: string[];
  status?: string;
}

export enum Session {
  ordinary = 'Ordinaria',
  extraordinary = 'Extraordinaria',
}
