import { Injectable } from '@angular/core';
import { Agreement } from '../interfaces/agreements.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private _agreements: Agreement[] = [
    {
      number: 1,
      area: 'human resourses',
      createdBy: 'doug',
      date: '2024-05-14',
      description: 'this is agreement 1',
      completed: false,
    },
    {
      number: 2,
      area: 'human resourses',
      createdBy: 'doug',
      date: '2024-05-14',
      description: 'this is agreement 2',
      completed: false,
    },
    {
      number: 3,
      area: 'human resourses',
      createdBy: 'doug',
      date: '2024-05-14',
      description: 'this is agreement 3',
      completed: false,
    },
  ];

  get agreements(): Agreement[] {
    return [...this._agreements];
  }

  insert(agreement: Agreement): void {
    this._agreements.push(agreement);
  }

  remove(id: number): void {
    this._agreements = this._agreements.filter(
      (agreement) => agreement.number !== id
    );
  }
}
