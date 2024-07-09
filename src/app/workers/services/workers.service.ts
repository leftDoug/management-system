import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Worker } from '../interfaces/worker.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this._apiUrl}/trabajadores`);
  }

  getByArea(area: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(
      `${this._apiUrl}/trabajadores?FK_idArea=${area}`
    );
  }

  getById(id: string): Observable<Worker> {
    return this.http.get<Worker>(`${this._apiUrl}/trabajadores/${id}`);
  }
}
