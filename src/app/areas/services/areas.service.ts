import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from '../interfaces/area.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  private _apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this._apiUrl}/areas`);
  }

  getById(id: string): Observable<Area> {
    return this.http.get<Area>(`${this._apiUrl}/areas/${id}`);
  }

  add(area: Area): Observable<Area> {
    return this.http.post<Area>(`${this._apiUrl}/areas`, area);
  }

  update(area: Area): Observable<Area> {
    return this.http.put<Area>(`${this._apiUrl}/areas/${area.id}`, area);
  }

  remove(id: string): Observable<Area> {
    return this.http.delete<Area>(`${this._apiUrl}/areas/${id}`);
  }
}
