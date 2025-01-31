import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { TypeOfMeeting } from '../interfaces/type-of-meeting.interface';
import { Observable, map } from 'rxjs';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { ToMResponse } from '../interfaces/type-of-meeting-response-interface';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/types-of-meetings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeOfMeeting[]> {
    return this.http
      .get<ToMResponse>(`${this._serverUrl}`)
      .pipe(map((res) => res.arg as unknown as TypeOfMeeting[]));
  }

  getById(id: string): Observable<TypeOfMeeting> {
    return this.http
      .get<ToMResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as TypeOfMeeting));
  }

  add(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
    return this.http.post<ToMResponse>(`${this._serverUrl}`, typeOfMeeting);
  }

  update(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
    return this.http.put<ToMResponse>(
      `${this._serverUrl}/${typeOfMeeting.id}`,
      typeOfMeeting
    );
  }

  remove(id: string): Observable<ToMResponse> {
    return this.http.delete<ToMResponse>(`${this._serverUrl}/${id}`);
  }

  getMeetings(id: string): Observable<Meeting[]> {
    return this.http
      .get<ToMResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((resp) => resp.arg as unknown as Meeting[]));
  }
}
