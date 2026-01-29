import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                this.userSubject.next(JSON.parse(stored));
            } catch (e) {
                console.error('Ошибка парсинга юзера', e);
            }
        }
    }
  }

  public get currentUserValue() {
    return this.userSubject.value;
  }

  register(username: string, pass: string) {
    return this.http.post<any>('http://localhost:5035/api/auth/register', { username, password: pass })
      .pipe(map(user => {
        this.setSession(user, username, pass);
        return user;
      }));
  }

  login(username: string, pass: string) {

    const authdata = btoa(`${username}:${pass}`);
    const user = { username, authdata };
    
    this.setSession(user, username, pass);
    this.userSubject.next(user);
    return true; 
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(user: any, username: string, pass: string) {
    if (typeof localStorage === 'undefined') return;

    if (!user.authdata) {
        user.authdata = btoa(`${username}:${pass}`);
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
}