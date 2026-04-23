import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest,LoginRequest, AuthResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl='https://localhost:7016/api/auth'
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_EMAIL_KEY = 'userEmail';
 
  constructor(private http: HttpClient, private router: Router) {}
 
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => this.storeUser(res))
    );
  }
 
  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.storeUser(res))
    );
  }
 
  private storeUser(res: AuthResponse): void {
    localStorage.setItem(this.USER_ID_KEY, String(res.id));
    localStorage.setItem(this.USER_EMAIL_KEY, res.email);
  }
 
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }
 
  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }
 
  isLoggedIn(): boolean {
    return !!this.getUserId();
  }
 
  logout(): void {
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    this.router.navigate(['auth']);
  }
}