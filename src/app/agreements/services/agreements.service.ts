import { Injectable } from '@angular/core';
import { Agreement } from '../interfaces/agreement.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  // private _agreements: Agreement[] = [
  //   {
  //     id: 'rh1',
  //     number: 1,
  //     workArea: 'RRHH',
  //     meeting: 'Reunion 1',
  //     session: 'Ordinaria',
  //     meetingStartTime: new Date(),
  //     meetingEndTime: new Date(),
  //     createdBy: 'Doug Left',
  //     meetingDate: new Date(),
  //     answer: '',
  //     agreementCompilanceDate: new Date(),
  //     status: Status.cumplido,
  //     responsible: 'Douglas Izquierdo',
  //     content: 'test 1',
  //   },
  //   {
  //     id: 'co1',
  //     number: 2,
  //     workArea: 'Contabilidad',
  //     meeting: 'Reunion 2',
  //     session: 'Extraordinaria',
  //     meetingStartTime: new Date(),
  //     meetingEndTime: new Date(),
  //     createdBy: 'Douglas Izquierdo',
  //     meetingDate: new Date(),
  //     answer: 'se cumplió',
  //     agreementCompilanceDate: new Date(),
  //     status: Status.incumplido,
  //     responsible: 'Douglas Izquierdo',
  //     content: 'test 2',
  //   },
  //   {
  //     id: 'tr1',
  //     number: 3,
  //     workArea: 'Transporte',
  //     meeting: 'Reunion 3',
  //     session: 'Ordinaria',
  //     meetingStartTime: new Date(),
  //     meetingEndTime: new Date(),
  //     createdBy: 'Otro',
  //     meetingDate: new Date(),
  //     answer: '',
  //     agreementCompilanceDate: new Date(),
  //     status: Status.en_proceso,
  //     responsible: 'Douglas Izquierdo',
  //     content: 'test 3',
  //   },
  // ];
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Agreement[]> {
    return this.http.get<Agreement[]>(`${this._apiUrl}/acuerdos`);
  }

  getById(id: string): Observable<Agreement> {
    return this.http.get<Agreement>(`${this._apiUrl}/acuerdos/${id}`);
  }

  add(agreement: Agreement): Observable<Agreement> {
    return this.http.post<Agreement>(`${this._apiUrl}/acuerdos`, agreement);
  }

  update(agreement: Agreement): Observable<Agreement> {
    return this.http.put<Agreement>(
      `${this._apiUrl}/acuerdos/${agreement.id}`,
      agreement
    );
  }

  // get agreements(): Agreement[] {
  //   return [...this._agreements];
  // }

  // getById(id: string): Agreement {
  //   return this._agreements.find((x) => x.id === id)!;
  // }

  // insert(agreement: Agreement): void {
  //   this._agreements.push(agreement);
  // }

  cancel(agreement: Agreement): Observable<Agreement> {
    // this.getById(id).status = Status.anulado;
    agreement.canceled = true;
    return this.update(agreement);
  }
}
