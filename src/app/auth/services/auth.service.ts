import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pathUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(): Observable<User> {
    return this.http.get<User>(`${this.pathUrl}/usuarios/1`);
  }
}
