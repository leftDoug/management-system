export interface Agenda {
  id: string;
  year: number;
  typeOfMeeting?: string;
  idTypeOfMeeting?: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  month: Date;
  monthNumber?: number;
}

// export interface MonthWithId {
//   id: number;
//   name: MonthName;
// }

// export interface MonthWithTopics {
//   name: MonthName;
//   topics: string[];
// }

// export enum MonthName {
//   january = 'Enero',
//   february = 'Febrero',
//   march = 'Marzo',
//   april = 'Abril',
//   may = 'Mayo',
//   june = 'Junio',
//   july = 'Julio',
//   august = 'Agosto',
//   september = 'Septiembre',
//   october = 'Octubre',
//   november = 'Noviembre',
//   december = 'Diciembre',
// }
