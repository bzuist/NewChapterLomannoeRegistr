import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { Injectable } from '@angular/core';
import { Credential } from 'src/app/models/auth/Credential';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ROLE } from './auth role';
import { Authority } from '../models/auth/auth';
import { Breakpoints } from '@angular/cdk/layout';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  logoutWithoutRedirect() {
    localStorage.removeItem('userData');
    console.log('Пользователь вышел из системы без перенаправления.');
  }

  register(crdls: Credential): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>('http://localhost:3000/users', crdls, { headers }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return this.handleLoginError('registration error', null)(error);
      })
    );
  }


  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
    private http: HttpClient,
  ) {
    const auth = localStorage.getItem('auth');
    this.loggedIn.next(this.isAuthNotEmpty(auth ?? ""));
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get LoggedUser(): CredentialResponse {
    const auth = localStorage.getItem('auth');
    if (!auth) return new CredentialResponse();
    return JSON.parse(auth) as CredentialResponse;
  }

  public isAdmin(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.SUPER_USER;
    }).length != 0;
  }

  isAuthor(): boolean {
    return this.LoggedUser.authorities.filter((auth: Authority) => {
      return auth.authority == ROLE.AUTHOR;
    }).length != 0;
  }

  static checkAuthUser(auth: CredentialResponse, role: string): boolean {
    let access = false;
    if (auth != null && auth.authorities !== null) {
      auth.authorities.some((el) => {
        console.log('el.authority: ' + el.authority);
        access = el.authority === role;
        return access;
      });
    }
    return access;
  }

  static checkSection(url: string, section: string): boolean {
    return url.indexOf(section) == 0;
  }

  authenticate(crdls: Credential, failureHandler: () => void) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}?username=${encodeURIComponent(crdls.username)}&password=${encodeURIComponent(crdls.password)}`;
    debugger
    this.http.get<any[]>(url, { headers }).subscribe(
      (users: any[]) => {
        if (users.length === 1) {
          const user = users[0];
          const response: CredentialResponse = {
            authenticated: true,
            name: user.username,
            authorities: user.roles?.map((r: string) => ({ authority: r })) || [],
            authToken: 'FAKE_TOKEN_' + user.username,
            userData: user
          };
          debugger
          this.responseProcessing(response, failureHandler);
        } else {
          console.error("Пользователь не найден или введены неверные данные");
          failureHandler();
        }
      },
      (error) => {
        console.error("Ошибка входа:", error);
        failureHandler();
      }
    );
  }


  private responseProcessing(data: CredentialResponse, failureHandler: () => void): boolean {
    const response: CredentialResponse | null = CredentialResponse.convertToObj(data);
    if (response !== null && response.authenticated == true) {
      debugger
      this.updateAuth(response);
      this.loggedIn.next(true);
      if(this.isAdmin())
      {
        this.router.navigate(['/main']);
      }
      if(this.isAuthor())
      {
        this.router.navigate(['author']);
      }
      return true;
    }
     else {
      failureHandler();
      return false;
    }
  }

  private updateAuth(response: CredentialResponse) {
    localStorage.setItem('auth', JSON.stringify(response));
  }

  logout() {
    this.clearLoginData();
    this.http.post('api/logout', {}).subscribe(response => {
      this.router.navigateByUrl('/login');
    });
  }

  clearLoginData() {
    this.loggedIn.next(false);
    localStorage.removeItem('auth');
  }

  authentication(headers: HttpHeaders): Observable<any> {
    return this.http.get('/users', { headers: headers })
      .pipe(
        tap(data => console.log('login data:', data)),
        catchError(this.handleLoginError('login error', []))
      );
  }

  private isAuthNotEmpty = (auth: string) => {
    return auth != null && auth != "";
  };

  private handleLoginError<T>(operation = 'operation', result?: T) {
    console.log('handleLoginError')
    return (error: any): Observable<T> => {
      if(error.status === 401) {
        this.loggedIn.next(false);
        return of(result as T);
      }
      else if(error.status == 404) {
        this.loggedIn.next(false);
        // @ts-ignore
        return of (
          {
            errorStatus: error.status
          }
        );
      }
      return of(result as T);
    };
  }
}
