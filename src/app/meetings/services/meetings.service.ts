import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Meeting } from '../interfaces/meeting.interface';
import { Agreement } from 'src/app/agreements/interfaces/agreement.interface';
import { MeetingResponse } from '../interfaces/meeting-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private _serverUrl = `${environment.serverUrl}/meetings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Meeting[]> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}`)
      .pipe(map((res) => res.arg as unknown as Meeting[]));
  }

  getById(id: string): Observable<Meeting> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as Meeting));
  }

  add(meeting: Meeting): Observable<MeetingResponse> {
    return this.http.post<MeetingResponse>(`${this._serverUrl}`, meeting);
  }

  update(meeting: Meeting): Observable<MeetingResponse> {
    return this.http.put<MeetingResponse>(
      `${this._serverUrl}/${meeting.id}`,
      meeting
    );
  }

  remove(id: string): Observable<MeetingResponse> {
    return this.http.delete<MeetingResponse>(`${this._serverUrl}/${id}`);
  }

  getAgreements(id: string): Observable<Agreement[]> {
    return this.http
      .get<MeetingResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as Agreement[]));
  }
}
