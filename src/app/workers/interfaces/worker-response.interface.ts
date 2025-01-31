import { Agreement } from 'src/app/agreements/interfaces/agreement.interface';
import { Area } from 'src/app/areas/interfaces/area.interface';

export interface WorkerResponse {
  ok: boolean;
  arg?: Worker[] | Agreement[] | Area[];
  msg?: string;
}
