import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Organization } from '../interfaces/organization.interface';
import { environment } from 'src/environments/environment.development';
import { OrganizationResponse } from '../interfaces/organization-response.interface';
import { ToMResponse } from 'src/app/types-of-meetings/interfaces/type-of-meeting-response-interface';
import { AuthResponse } from 'src/app/auth/interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  // private _apiUrl: string = environment.apiUrl;
  private _serverUrl: string = `${environment.serverUrl}/organizations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(this._serverUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err.error);
      })
    );
  }

  getById(id: string): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(`${this._serverUrl}/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err.error);
      })
    );
  }

  getInfo(id: string): Observable<OrganizationResponse> {
    return this.http
      .get<OrganizationResponse>(`${this._serverUrl}/info/${id}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
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
  update(organization: Organization): Observable<OrganizationResponse> {
    return this.http
      .patch<OrganizationResponse>(
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

  remove(organization: Organization): Observable<OrganizationResponse> {
    return this.http
      .patch<OrganizationResponse>(
        `${this._serverUrl}/remove/${organization.id}`,
        organization
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  // FIXME: quitar este
  erase(id: number): Observable<OrganizationResponse> {
    return this.http
      .delete<OrganizationResponse>(`${this._serverUrl}/remove/${id}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err.error);
        })
      );
  }

  getToMs(id: string): Observable<ToMResponse> {
    return this.http.get<ToMResponse>(`${this._serverUrl}/${id}/toms`).pipe(
      catchError((err: HttpErrorResponse) => {
        return of(err.error);
      })
    );
  }

  getWorkers(id: string): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/${id}/workers`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  // FIXME: arreglar el create en el back y quitar este
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

  // FIXME: arreglar el update en el back y quitar este
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
