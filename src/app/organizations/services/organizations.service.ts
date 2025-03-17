import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import {
  Organization,
  OrganizationView,
} from '../interfaces/organization.interface';
import { environment } from 'src/environments/environment.development';
import { OrganizationResponse } from '../interfaces/organization-response.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { StandardResponse } from 'src/app/shared/interfaces/standard.interface';
import { WorkerResponse } from 'src/app/auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/organizations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrganizationView[]> {
    return this.http
      .get<OrganizationResponse>(this._serverUrl)
      .pipe(map((resp) => resp.arg as unknown as OrganizationView[]));
  }

  getById(id: string): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(`${this._serverUrl}/${id}`).pipe(
      map((res) => {
        return res.ok
          ? { ok: res.ok, arg: res.arg as unknown as Organization }
          : { ok: res.ok, msg: res.msg };
      })
    );
  }

  add(organization: Organization): Observable<OrganizationResponse> {
    return this.http
      .post<OrganizationResponse>(`${this._serverUrl}`, organization)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  // XXX no lanza error
  update(organization: Organization): Observable<StandardResponse> {
    return this.http
      .patch<StandardResponse>(
        `${this._serverUrl}/${organization.id}`,
        organization
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  // XXX lanza un error
  // update(organization: Organization): Observable<StandardResponse> {
  //   return this.http
  //     .patch<StandardResponse>(
  //       `${this._serverUrl}/${organization.id}`,
  //       organization
  //     )
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return throwError(() => err.error as StandardResponse);
  //       })
  //     );
  // }

  remove(organization: Organization): Observable<StandardResponse> {
    return this.http.patch<StandardResponse>(
      `${this._serverUrl}/remove/${organization.id}`,
      organization
    );
  }

  erase(id: number): Observable<StandardResponse> {
    return this.http.delete<StandardResponse>(
      `${this._serverUrl}/remove/${id}`
    );
  }

  getToM(id: string): Observable<TypeOfMeeting[]> {
    return this.http
      .get<OrganizationResponse>(`${this._serverUrl}/${id}/meetings`)
      .pipe(map((res) => res.arg as unknown as TypeOfMeeting[]));
  }

  getWorkers(id: string): Observable<WorkerResponse[]> {
    return this.http
      .get<OrganizationResponse>(`${this._serverUrl}/${id}/workers`)
      .pipe(map((res) => res.arg as unknown as WorkerResponse[]));
  }

  addWorkers(
    id: number,
    workersId: string[]
  ): Observable<OrganizationResponse> {
    return this.http
      .post<OrganizationResponse>(`${this._serverUrl}/${id}`, { workersId })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  updateWorkers(
    id: number,
    workersId: string[]
  ): Observable<OrganizationResponse> {
    return this.http
      .patch<OrganizationResponse>(`${this._serverUrl}/${id}/workers`, {
        workersId,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }
}
