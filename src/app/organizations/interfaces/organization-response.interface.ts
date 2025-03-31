import { Organization } from './organization.interface';

export interface OrganizationResponse {
  ok: boolean;
  arg?: Organization | Organization[];
  msg?: string;
}
