import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Agenda } from '../interfaces/agenda.interface';
import { AgendaResponse } from '../interfaces/agenda-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AgendasService {
  private _serverUrl: string = `${environment.apiUrl}/agendas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Agenda[]> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}`)
      .pipe(map((res) => res.arg as unknown as Agenda[]));
  }

  getById(id: string): Observable<Agenda> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as Agenda));
  }

  add(agenda: Agenda): Observable<AgendaResponse> {
    return this.http.post<AgendaResponse>(`${this._serverUrl}`, agenda);
  }

  update(agenda: Agenda): Observable<AgendaResponse> {
    return this.http.put<AgendaResponse>(
      `${this._serverUrl}/${agenda.id}`,
      agenda
    );
  }

  remove(id: string): Observable<AgendaResponse> {
    return this.http.delete<AgendaResponse>(`${this._serverUrl}/${id}`);
  }
}
