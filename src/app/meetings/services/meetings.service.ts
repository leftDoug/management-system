import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Meeting } from '../interfaces/meeting.interface';
import { Agreement } from 'src/app/agreements/interfaces/agreement.interface';
import { MeetingResponse } from '../interfaces/meeting-response.interface';
import { AuthResponse } from 'src/app/auth/interfaces/auth-response.interface';
import { AgreementResponse } from 'src/app/agreements/interfaces/agreement-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private _serverUrl = `${environment.serverUrl}/meetings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MeetingResponse> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<MeetingResponse> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getInfo(id: string): Observable<MeetingResponse> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}/info/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getParticipants(id: string): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/${id}/participants`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  add(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .post<MeetingResponse>(`${this._serverUrl}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this._serverUrl}/${meeting.id}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  remove(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this._serverUrl}/${meeting.id}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getAgreements(id: string): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this._serverUrl}/agreements/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  setAttendance(
    id: string,
    attendants: { attendants: string[] }
  ): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this._serverUrl}/attendance/${id}`, attendants)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  setOpen(id: string): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this._serverUrl}/open/${id}`, null)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  setClose(id: string): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this._serverUrl}/close/${id}`, null)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
