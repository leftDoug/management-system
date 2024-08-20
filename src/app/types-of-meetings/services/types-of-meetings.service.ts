import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { TypeOfMeeting } from '../interfaces/type-of-meeting.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeOfMeeting[]> {
    return this.http.get<TypeOfMeeting[]>(`${this._apiUrl}/tipos-de-reuniones`);
  }

  getById(id: string): Observable<TypeOfMeeting> {
    return this.http.get<TypeOfMeeting>(
      `${this._apiUrl}/tipos-de-reuniones/${id}`
    );
  }

  add(typeOfMeeting: TypeOfMeeting): Observable<TypeOfMeeting> {
    return this.http.post<TypeOfMeeting>(
      `${this._apiUrl}/tipos-de-reuniones`,
      typeOfMeeting
    );
  }

  update(typeOfMeeting: TypeOfMeeting): Observable<TypeOfMeeting> {
    return this.http.put<TypeOfMeeting>(
      `${this._apiUrl}/tipos-de-reuniones/${typeOfMeeting.id}`,
      typeOfMeeting
    );
  }

  remove(id: string): Observable<TypeOfMeeting> {
    return this.http.delete<TypeOfMeeting>(
      `${this._apiUrl}/tipos-de-reuniones/${id}`
    );
  }
}
