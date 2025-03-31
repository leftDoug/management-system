import { Agenda } from './agenda.interface';

export interface AgendaResponse {
  ok: boolean;
  arg?: Agenda | Agenda[];
  msg?: string;
}
