import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pathUrl: string = environment.apiUrl;
  private _user: User | undefined;

  constructor(private http: HttpClient) {}

  get user() {
    return { ...this._user };
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
      })
    );
  }
}
