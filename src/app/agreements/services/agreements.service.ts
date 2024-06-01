import { Injectable } from '@angular/core';
import { Agreement } from '../interfaces/agreements.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private _agreements: Agreement[] = [
    {
      id: 'rh1',
      number: 1,
      area: 'RRHH',
      meeting: 'Reunion 1',
      session: 'Ordinaria',
      meetingStartTime: new Date(),
      meetingEndTime: new Date(),
      createdBy: 'Doug Left',
      meetingDate: new Date(),
      solution: '',
      fulfilled: false,
      agreementCompilanceDate: new Date(),
      status: true,
      // TODO: agregar contenido y encargado
    },
    {
      id: 'co1',
      number: 2,
      area: 'Contabilidad',
      meeting: 'Reunion 2',
      session: 'Extraordinaria',
      meetingStartTime: new Date(),
      meetingEndTime: new Date(),
      createdBy: 'Douglas Izquierdo',
      meetingDate: new Date(),
      solution: 'se cumplió',
      fulfilled: true,
      agreementCompilanceDate: new Date(),
      status: true,
      // TODO: agregar contenido y encargado
    },
    {
      id: 'tr1',
      number: 3,
      area: 'Transporte',
      meeting: 'Reunion 3',
      session: 'Ordinaria',
      meetingStartTime: new Date(),
      meetingEndTime: new Date(),
      createdBy: 'Otro',
      meetingDate: new Date(),
      solution: '',
      fulfilled: false,
      agreementCompilanceDate: new Date(),
      status: false,
      // TODO: agregar contenido y encargado
    },
  ];

  get agreements(): Agreement[] {
    return [...this._agreements];
  }

  getById(id: string): Agreement {
    return this._agreements.find((x) => x.id === id)!;
  }

  insert(agreement: Agreement): void {
    this._agreements.push(agreement);
  }

  remove(id: string): void {
    this.getById(id).status = false;
  }
}
