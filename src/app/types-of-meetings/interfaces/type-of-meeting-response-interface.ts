import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { TypeOfMeeting } from './type-of-meeting.interface';

export interface ToMResponse {
  ok: boolean;
  arg?: TypeOfMeeting[] | Meeting[];
  msg?: string;
}
