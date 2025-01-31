import { Agreement } from 'src/app/agreements/interfaces/agreement.interface';
import { Meeting } from './meeting.interface';

export interface MeetingResponse {
  ok: boolean;
  arg?: Meeting[] | Agreement[];
  msg?: string;
}
