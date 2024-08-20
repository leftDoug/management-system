export interface TypeOfMeeting {
  id: string;
  FK_idWorkArea: string;
  name: string;
  frequency: Frequency;
}

export enum Frequency {
  daily = 'Diaria',
  weekly = 'Semanal',
  fortnightly = 'Quincenal',
  monthly = 'Mensual',
  yearly = 'Anual',
}
