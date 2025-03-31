import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { TypeOfMeeting } from '../interfaces/type-of-meeting.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { ToMResponse } from '../interfaces/type-of-meeting-response-interface';
import { StandardResponse } from 'src/app/shared/interfaces/standard.interface';
import { AgendaResponse } from 'src/app/agenda/interfaces/agenda-response.interface';
import { MeetingResponse } from 'src/app/meetings/interfaces/meeting-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/types-of-meetings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ToMResponse> {
    return this.http
      .get<ToMResponse>(`${this._serverUrl}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<ToMResponse> {
    return this.http.get<ToMResponse>(`${this._serverUrl}/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err.error);
      })
    );
  }

  getAgendas(id: string): Observable<AgendaResponse> {
    return this.http
      .get<AgendaResponse>(`${this._serverUrl}/${id}/agendas`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  add(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
    return this.http
      .post<ToMResponse>(`${this._serverUrl}`, typeOfMeeting)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  update(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
    return this.http
      .patch<ToMResponse>(
        `${this._serverUrl}/${typeOfMeeting.id}`,
        typeOfMeeting
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  remove(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
    return this.http
      .patch<ToMResponse>(
        `${this._serverUrl}/remove/${typeOfMeeting.id}`,
        typeOfMeeting
      )
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getMeetings(id: string): Observable<MeetingResponse> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}/${id}/meetings`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
