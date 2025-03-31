import { Agreement, Response } from './agreement.interface';

export interface AgreementResponse {
  ok: boolean;
  arg?: Agreement | Agreement[] | Response[];
  msg?: string;
}
