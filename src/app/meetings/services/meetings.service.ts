import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Meeting } from '../interfaces/meeting.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this._apiUrl}/reuniones`);
  }

  getById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this._apiUrl}/reuniones/${id}`);
  }

  add(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${this._apiUrl}/reuniones`, meeting);
  }

  update(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(
      `${this._apiUrl}/reuniones/${meeting.id}`,
      meeting
    );
  }

  remove(id: string): Observable<Meeting> {
    return this.http.delete<Meeting>(`${this._apiUrl}/reuniones/${id}`);
  }
}
