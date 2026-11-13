import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://127.0.0.1:8000/api';

  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  get token() {
    return this.tokenSignal();
  }

  estaLogueado() {
    return this.tokenSignal() !== null;
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/auth/login/`, { username, password })
      .pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.token);
          this.tokenSignal.set(resp.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }
}
