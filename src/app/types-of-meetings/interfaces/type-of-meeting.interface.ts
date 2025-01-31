export interface TypeOfMeeting {
  id: string;
  area_id?: string;
  area?: string;
  name: string;
  frequency: Frequency;
  state: boolean;
}

export enum Frequency {
  daily = 'Diaria',
  weekly = 'Semanal',
  fortnightly = 'Quincenal',
  monthly = 'Mensual',
  yearly = 'Anual',
}
