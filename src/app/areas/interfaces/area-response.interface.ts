import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Area } from './area.interface';

export interface AreaResponse {
  ok: boolean;
  arg?: Area[] | Meeting[] | Worker[];
  msg: string;
}
