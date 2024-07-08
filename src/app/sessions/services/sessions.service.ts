import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Session } from '../interfaces/session.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this._apiUrl}/sesiones`);
  }

  getById(id: string): Observable<Session> {
    return this.http.get<Session>(`${this._apiUrl}/sesiones/${id}`);
  }
}
