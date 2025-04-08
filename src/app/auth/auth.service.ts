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
    return this.http.post('/api/register', crdls, { headers: headers }).pipe(
      tap(response => console.log('Registration successful:', response)),
      catchError(this.handleLoginError('registration error', null))
    );
  }

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
    private http: HttpClient,
    private sessionStorage: SessionStorageService) {
      const auth = this.sessionStorage.get('auth');
      this.loggedIn.next(this.isAuthNotEmpty(auth));
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get LoggedUser(): CredentialResponse {
    const auth = this.sessionStorage.get('auth');
    if(auth == null || auth == "") {
      return new CredentialResponse();
    }
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

  authenticate(crdls: Credential, failureHandler: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Отправка запроса на эндпоинт /login с логином и паролем в теле
    this.http.post<CredentialResponse>('/login', crdls, { headers: headers }).subscribe(
      (data: CredentialResponse | null) => {
        console.log(data);
        if (data != null) {
          this.responseProcessing(data, failureHandler);
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
      this.updateAuth(response);
      this.loggedIn.next(true);
      if(this.isAdmin())
      {
        this.router.navigate(['admin']);
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
    this.sessionStorage.set('auth', JSON.stringify(response));
  }

  logout() {
    this.clearLoginData();
    this.http.post('api/logout', {}).subscribe(response => {
      this.router.navigateByUrl('/login');
    });
  }

  clearLoginData() {
    this.loggedIn.next(false);
    this.sessionStorage.remove('auth');
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
