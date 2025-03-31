import { Meeting } from './meeting.interface';

export interface MeetingResponse {
  ok: boolean;
  arg?: Meeting | Meeting[];
  msg?: string;
}
