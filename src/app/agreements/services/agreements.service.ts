import { Injectable } from '@angular/core';
import { Agreement } from '../interfaces/agreement.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AgreementResponse } from '../interfaces/agreement-response.interface';
import { LoadingService } from 'src/app/shared/loading/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private _serverUrl: string = `${environment.serverUrl}/agreements`;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAll(): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this._serverUrl}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this._serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  // XXX arrglar las rutas para k tengan el id al final
  getInfo(id: string): Observable<AgreementResponse> {
    this.loadingService.show();

    return this.http
      .get<AgreementResponse>(`${this._serverUrl}/info/${id}`)
      .pipe(
        catchError((err: HttpErrorResponse) => of(err.error)),
        finalize(() => this.loadingService.hide())
      );
  }

  getResponses(id: string): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this._serverUrl}/responses/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  add(agreement: Agreement): Observable<AgreementResponse> {
    return this.http
      .post<AgreementResponse>(`${this._serverUrl}`, agreement)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  addResponse(response: {
    idAgreement: string;
    content: string;
  }): Observable<AgreementResponse> {
    return this.http
      .post<AgreementResponse>(`${environment.serverUrl}/responses`, response)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(agreement: Agreement): Observable<AgreementResponse> {
    return this.http
      .patch<AgreementResponse>(`${this._serverUrl}/${agreement.id}`, {
        compilanceDate: agreement.compilanceDate,
      })
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  setCompleted(id: string): Observable<AgreementResponse> {
    return this.http
      .patch<AgreementResponse>(`${this._serverUrl}/complete/${id}`, null)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
