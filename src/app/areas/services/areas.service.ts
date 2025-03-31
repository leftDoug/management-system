import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Area } from '../interfaces/area.interface';
import { environment } from 'src/environments/environment.development';
import { AreaResponse } from '../interfaces/area-response.interface';
import { ToMResponse } from 'src/app/types-of-meetings/interfaces/type-of-meeting-response-interface';
import { AuthResponse } from 'src/app/auth/interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/areas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AreaResponse> {
    return this.http
      .get<AreaResponse>(this._serverUrl)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<AreaResponse> {
    return this.http
      .get<AreaResponse>(`${this._serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  add(area: Area): Observable<AreaResponse> {
    return this.http
      .post<AreaResponse>(`${this._serverUrl}`, area)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(area: Area): Observable<AreaResponse> {
    return this.http
      .patch<AreaResponse>(`${this._serverUrl}/${area.id}`, area)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  remove(area: Area): Observable<AreaResponse> {
    return this.http
      .patch<AreaResponse>(`${this._serverUrl}/${area.id}/remove`, area)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getToM(id: string): Observable<ToMResponse> {
    return this.http
      .get<ToMResponse>(`${this._serverUrl}/${id}/types-of-meetings`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getWorkers(id: string): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/${id}/workers`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
