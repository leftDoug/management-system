import { TypeOfMeeting } from './type-of-meeting.interface';

export interface ToMResponse {
  ok: boolean;
  arg?: TypeOfMeeting | TypeOfMeeting[];
  msg?: string;
}
