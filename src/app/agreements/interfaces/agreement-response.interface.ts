import { Agreement } from './agreement.interface';

export interface AgreementResponse {
  ok: true;
  arg?: Agreement[];
  msg?: string;
}
