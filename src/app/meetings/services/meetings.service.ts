import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Meeting } from '../interfaces/meeting.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this._apiUrl}/reuniones`);
  }
}
