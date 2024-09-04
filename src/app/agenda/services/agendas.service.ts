import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Agenda } from '../interfaces/agenda.interface';

@Injectable({
  providedIn: 'root',
})
export class AgendasService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this._apiUrl}/agendas`);
  }

  getById(id: string): Observable<Agenda> {
    return this.http.get<Agenda>(`${this._apiUrl}/agendas/${id}`);
  }

  getByIdTypeOfMeeting(id: string): Observable<Agenda> {
    return this.http.get<Agenda>(
      `${this._apiUrl}/agendas?FK_idTypeOfMeeting=${id}`
    );
  }

  add(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(`${this._apiUrl}/agendas`, agenda);
  }

  update(agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(
      `${this._apiUrl}/agendas/${agenda.id}`,
      agenda
    );
  }

  remove(id: string): Observable<Agenda> {
    return this.http.delete<Agenda>(`${this._apiUrl}/agendas/${id}`);
  }
}
