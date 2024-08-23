import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WorkerArea } from '../navbar/worker-area.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkersAreasService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<WorkerArea[]> {
    return this.http.get<WorkerArea[]>(`${this._apiUrl}/trabajadores-areas`);
  }

  getByIdWorker(id: string): Observable<WorkerArea[]> {
    return this.http.get<WorkerArea[]>(
      `${this._apiUrl}/trabajadores-areas?FK_idWorker=${id}`
    );
  }

  getByIdArea(id: string): Observable<WorkerArea[]> {
    return this.http.get<WorkerArea[]>(
      `${this._apiUrl}/trabajadores-areas?FK_idWorkArea=${id}`
    );
  }

  add(workerArea: WorkerArea): Observable<WorkerArea> {
    return this.http.post<WorkerArea>(
      `${this._apiUrl}/trabajadores-areas`,
      workerArea
    );
  }

  update(workerArea: WorkerArea): Observable<WorkerArea> {
    return this.http.put<WorkerArea>(
      `${this._apiUrl}/trabajadores-areas/${workerArea.id}`,
      workerArea
    );
  }

  remove(id: string): Observable<WorkerArea> {
    return this.http.delete<WorkerArea>(
      `${this._apiUrl}/trabajadores-areas/${id}`
    );
  }
}
