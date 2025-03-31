import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Agenda, Topic } from '../interfaces/agenda.interface';
import { AgendaResponse } from '../interfaces/agenda-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AgendasService {
  private _serverUrl: string = `${environment.serverUrl}/agendas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AgendaResponse> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<AgendaResponse> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getInfo(id: string): Observable<AgendaResponse> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}/${id}/info`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  add(agenda: Agenda): Observable<AgendaResponse> {
    return this.http
      .post<AgendaResponse>(`${this._serverUrl}`, agenda)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  // FIXME: quitar este y actualizar la creacion en el back
  addTopic(idAgenda: string, topic: Topic): Observable<AgendaResponse> {
    return this.http
      .post<AgendaResponse>(`${environment.serverUrl}/topics`, {
        name: topic.name,
        month: topic.month,
        idAgenda,
      })
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  // FIXME: quitar este tb
  eraseTopics(idAgenda: string): Observable<AgendaResponse> {
    return this.http
      .delete<AgendaResponse>(`${environment.serverUrl}/topics/${idAgenda}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(agenda: Agenda): Observable<AgendaResponse> {
    return this.http
      .patch<AgendaResponse>(`${this._serverUrl}/${agenda.id}`, agenda)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  remove(agenda: Agenda): Observable<AgendaResponse> {
    return this.http
      .patch<AgendaResponse>(`${this._serverUrl}/${agenda.id}/remove`, agenda)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  // FIXME: quitar este tb
  erase(id: string): Observable<AgendaResponse> {
    return this.http
      .delete<AgendaResponse>(`${this._serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
