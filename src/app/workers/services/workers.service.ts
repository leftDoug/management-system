import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable, map } from 'rxjs';
import { Worker } from '../interfaces/worker.interface';
import { WorkerResponse } from '../interfaces/worker-response.interface';
import { Agreement } from 'src/app/agreements/interfaces/agreement.interface';
import { Area } from 'src/app/areas/interfaces/area.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private _serverUrl: string = `${environment.serverUrl}/workers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Worker[]> {
    return this.http
      .get<WorkerResponse>(`${this._serverUrl}`)
      .pipe(map((res) => res.arg as unknown as Worker[]));
  }

  getById(id: string): Observable<Worker> {
    console.log(`${this._serverUrl}/${id}`);
    return this.http
      .get<WorkerResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as Worker));
  }

  create(worker: Worker, areas: string[]): Observable<WorkerResponse> {
    const workerwithAreas = {
      name: worker.name,
      occupation: worker.occupation,
      email: worker.email,
      idAreas: areas,
    };
    return this.http.post<WorkerResponse>(
      `${this._serverUrl}`,
      workerwithAreas
    );
  }

  update(worker: Worker): Observable<WorkerResponse> {
    return this.http.put<WorkerResponse>(
      `${this._serverUrl}/${worker.id}`,
      worker
    );
  }

  remove(worker: Worker): Observable<WorkerResponse> {
    return this.http.delete<WorkerResponse>(`${this._serverUrl}/${worker.id}`);
  }

  getAgreements(id: string): Observable<Agreement[]> {
    return this.http
      .get<WorkerResponse>(`${this._serverUrl}/${id}`)
      .pipe(map((res) => res.arg as unknown as Agreement[]));
  }

  getAreas(id: string): Observable<Area[]> {
    return this.http
      .get<WorkerResponse>(`${this._serverUrl}/${id}/areas`)
      .pipe(map((res) => res.arg as unknown as Area[]));
  }

  addArea(id: string, idArea: string): Observable<string> {
    const area = { idArea: idArea };
    return this.http
      .post<WorkerResponse>(`${this._serverUrl}/${id}/areas`, area)
      .pipe(map((resp) => resp.msg as string));
  }

  removeArea(id: string, area_id: string): Observable<string> {
    return this.http
      .delete<WorkerResponse>(`${this._serverUrl}/${id}/areas/${area_id}`)
      .pipe(map((resp) => resp.msg as string));
  }
}
