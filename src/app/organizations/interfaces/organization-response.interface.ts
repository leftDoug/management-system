import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Organization } from './organization.interface';
import { User } from 'src/app/auth/interfaces/user.interface';

export interface OrganizationResponse {
  ok: boolean;
  id?: number;
  arg?: Organization | Organization[] | Meeting[] | User[];
  msg?: string;
}
