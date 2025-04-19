import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { AuthResponse } from '@shared/models/auth';

const TOKEN_KEY = 'auth-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = 'api/auth';

  private statusSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  isAuthorized$: Observable<boolean> = this.statusSubject.asObservable();

  constructor(private cookieService: CookieService) {
    if (this.cookieService.get(TOKEN_KEY) != null) {
      this.statusSubject.next(true);
    } else {
      this.statusSubject.next(false);
    }
  }

  private storeToken(token: string) {
    if (token) {
      this.cookieService.set(TOKEN_KEY, token, {
        secure: true,
        sameSite: 'Strict',
        path: '/',
        expires: 1,
      });
    }
    this.statusSubject.next(true);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(tap((response: AuthResponse) => this.storeToken(response.token)));
  }

  logout(): void {
    this.cookieService.delete(TOKEN_KEY);
    this.statusSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get(TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return this.cookieService.get(TOKEN_KEY) || null;
  }

  removeAccessToken(): void {
    this.cookieService.delete(TOKEN_KEY);
  }
}
