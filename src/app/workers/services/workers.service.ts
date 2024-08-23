import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Worker, WorkerX } from '../interfaces/worker.interface';

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

  xgetAll(): Observable<WorkerX[]> {
    return this.http.get<WorkerX[]>(`${this._apiUrl}/trabajadores`);
  }

  xgetByArea(area: string): Observable<WorkerX[]> {
    return this.http.get<WorkerX[]>(
      `${this._apiUrl}/trabajadores?FK_idArea=${area}`
    );
  }

  xgetById(id: string): Observable<WorkerX> {
    return this.http.get<WorkerX>(`${this._apiUrl}/trabajadores/${id}`);
  }

  add(worker: WorkerX): Observable<WorkerX> {
    return this.http.post<WorkerX>(`${this._apiUrl}/trabajadores`, worker);
  }

  update(worker: WorkerX): Observable<WorkerX> {
    return this.http.put<WorkerX>(
      `${this._apiUrl}/trabajadores/${worker.id}`,
      worker
    );
  }

  remove(worker: WorkerX): Observable<WorkerX> {
    return this.http.delete<WorkerX>(
      `${this._apiUrl}/trabajadores/${worker.id}`
    );
  }
}
