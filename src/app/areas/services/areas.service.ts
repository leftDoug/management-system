import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Area } from '../interfaces/area.interface';
import { environment } from 'src/environments/environment.development';
import { AreaResponse } from '../interfaces/area-response.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/areas`;

  constructor(private http: HttpClient) {}

  // getAll(): Observable<Area[]> {
  //   return this.http.get<Area[]>(`${this._apiUrl}/areas`);
  // }

  getAll(): Observable<Area[]> {
    return this.http
      .get<AreaResponse>(this._serverUrl)
      .pipe(map((resp) => resp.arg as unknown as Area[]));
  }

  getById(id: string): Observable<Area> {
    return this.http
      .get<AreaResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as Area));
  }

  add(area: Area): Observable<AreaResponse> {
    return this.http.post<AreaResponse>(`${this._serverUrl}`, area);
  }

  update(area: Area): Observable<AreaResponse> {
    return this.http.put<AreaResponse>(`${this._serverUrl}/${area.id}`, area);
  }

  remove(id: string): Observable<AreaResponse> {
    return this.http.delete<AreaResponse>(`${this._serverUrl}/${id}`);
  }

  getToM(id: string): Observable<TypeOfMeeting[]> {
    return this.http
      .get<AreaResponse>(`${this._serverUrl}/${id}/meetings`)
      .pipe(map((res) => res.arg as unknown as TypeOfMeeting[]));
  }

  getWorkers(id: string): Observable<Worker[]> {
    return this.http
      .get<AreaResponse>(`${this._serverUrl}/${id}/workers`)
      .pipe(map((res) => res.arg as unknown as Worker[]));
  }
}
