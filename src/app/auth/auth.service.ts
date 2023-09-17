import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = environment.apiURL;

  constructor(private http: HttpClient) {}

  public login(email: string, password: string, rememberMe: boolean) {
    const { url, options } = this.getUrlAndOptions('auth/login', true);
    const credentials = { email, password, rememberMe };
    return this.http.post(url, credentials, options).pipe(this.handleError('Failed to login.'));
  }

  public logout(): Observable<unknown> {
    const { url, options } = this.getUrlAndOptions('auth/logout', true);
    return this.http.post(url, {}, options).pipe(this.handleError('Failed to logout.'));
  }

  public isAuthenticated(): Observable<boolean> {
    const { url, options } = this.getUrlAndOptions('auth/check', true);
    return this.http.get<any>(url, options).pipe(
      map((res) => (res.authenticated ? true : false)),
      catchError((err) => of(false))
    );
  }

  private getUrlAndOptions(path: string, useCredentials: boolean, id?: string) {
    const url = id ? `${this.API}/${path}/${id}` : `${this.API}/${path}`;
    const options = useCredentials ? { withCredentials: true } : {};
    return { url, options };
  }

  private handleError(message: string) {
    return catchError((err) => {
      console.error(message, err);
      return throwError(() => new Error(err));
    });
  }
}
