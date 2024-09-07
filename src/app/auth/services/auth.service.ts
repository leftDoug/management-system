import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { TestUser, User, UserLogin } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pathUrl: string = environment.apiUrl;
  private _user: User | undefined;

  private serverUrl: string = environment.serverUrl;
  private _testUser!: TestUser;

  constructor(private http: HttpClient) {}

  get user() {
    return { ...this._user };
  }

  get testUser() {
    return { ...this._testUser };
  }

  getByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.pathUrl}/usuarios?username=${username}`
    );
  }

  getByIdWorker(id: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.pathUrl}/usuarios?FK_idWorker=${id}`);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.pathUrl}/usuarios`);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.pathUrl}/usuarios`, user);
  }

  login(usr: string, pwd: string): Observable<User[]> {
    return this.getByUsername(usr).pipe(
      tap((u) => {
        if (u[0].password === pwd) {
          this._user = u[0];
        }
      }),
      tap((u) => localStorage.setItem('token', u[0].id))
    );
  }

  checkAuthentication(): Observable<boolean> {
    // if (!localStorage.getItem('token')) {
    //   return of(false);
    // }

    if (this.testUser.id) {
      return of(true);
    }

    return of(false);
  }

  testLogin(
    username: string,
    password: string
  ): Observable<AuthResponse | boolean> {
    const url: string = `${this.serverUrl}/auth`;
    const body: UserLogin = { username, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.setUserInfo(resp);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(false))
    );
  }

  validateToken(): Observable<boolean> {
    const url: string = `${this.serverUrl}/auth/renovar`;
    const headers: HttpHeaders = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        this.setUserInfo(resp);

        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  setUserInfo(response: AuthResponse): void {
    localStorage.setItem('token', response.token!);

    this._testUser = {
      id: response.id!,
      username: response.username!,
    };
  }

  logout(): void {
    localStorage.clear();
  }

  testRegister(username: string, password: string) {
    const url: string = `${this.serverUrl}/auth/registrarse`;
    const body: UserLogin = { username, password };

    return this.http.post<AuthResponse>(url, body).pipe(
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
