import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import {
  UserLogged,
  User,
  UserLogin,
  UserResponse,
  WorkerResponse,
} from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Role } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _serverUrl: string = `${environment.serverUrl}/auth`;
  private _userLogged!: UserLogged;

  constructor(private http: HttpClient) {}

  get user() {
    return { ...this._userLogged };
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/users`)
      .pipe(map((res) => res.arg as unknown as UserResponse[]));
  }

  getWorkers(): Observable<WorkerResponse> {
    return this.http
      .get<WorkerResponse>(`${this._serverUrl}/workers`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getRoles(): Observable<Role[]> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/roles`)
      .pipe(map((resp) => resp.arg as unknown as Role[]));
  }

  getRole(id: string): Observable<string> {
    return this.http
      .get<AuthResponse>(`${this._serverUrl}/users/${id}/role`)
      .pipe(map((resp) => (resp.arg as unknown as Role).role));
  }

  login(user: UserLogin): Observable<AuthResponse | boolean> {
    return this.http.post<AuthResponse>(`${this._serverUrl}/login`, user).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.setUserInfo(resp);
        }
      }),
      map((resp) => resp.ok),
      catchError(() => of(false))
    );
  }

  validateToken(): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http
      .get<AuthResponse>(`${this._serverUrl}/renew`, { headers })
      .pipe(
        map((resp) => {
          this.setUserInfo(resp);

          if (!resp.ok) {
            this.logout();
          }

          return resp.ok;
        }),
        catchError(() => of(false))
      );
  }

  setUserInfo(response: AuthResponse): void {
    localStorage.setItem('token', response.token!);

    this._userLogged = {
      id: response.id!,
      idWorker: response.idWorker!,
    };
  }

  logout(): void {
    this._userLogged = {
      id: '',
      idWorker: '',
    };

    localStorage.clear();
  }

  register(user: User) {
    return this.http
      .post<AuthResponse>(`${this._serverUrl}/register`, user)
      .pipe(
        tap((resp) => {
          if (resp.ok) {
            this.setUserInfo(resp);
          }
        }),
        map((resp) => resp.ok),
        catchError((err) => of(err.error.msg))
      );
  }
}
