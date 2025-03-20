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
import { User } from '../models/user';


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

  authenticate(
    crdls: Credential,
    successHandler: (authToken: string, user: User) => void,
    failureHandler: (error?: any) => void
  ) {
    const headers = new HttpHeaders(crdls ? {
        authorization: 'Basic ' + btoa(crdls.username + ':' + crdls.password),
        "X-Requested-With": "XMLHttpRequest"
    } : {});

    this.authentication(headers).subscribe({
        next: (data: CredentialResponse | null) => {
            if (data && data.authenticated) {
                this.responseProcessing(data, successHandler, () => {
                    failureHandler({ error: 'Неверный логин или пароль' });
                });
            } else {
                failureHandler({ error: 'Неверный логин или пароль' });
            }
        },
        error: (error: any) => {
            let errorMessage = 'Произошла неизвестная ошибка.';
            if (error.error?.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.status) {
                errorMessage = `Ошибка HTTP ${error.status}`;
            }
            failureHandler({ error: errorMessage });
        }
    });
  }


  private responseProcessing(
    data: CredentialResponse,
    successHandler: (authToken: string, user: User) => void,
    failureHandler: () => void
  ): boolean {
      const response: CredentialResponse | null = CredentialResponse.convertToObj(data);

      if (response !== null && response.authenticated) {
          this.updateAuth(response);
          this.loggedIn.next(true);

          // const token = response.authToken || "";

          // const user: User = response.userData || {
          //   id: 0,
          //   username: "Гость",
          //   principal: null,
          //   bookshelfID: null,
          //   bookID: null,
          //   postID: null
          // } as User;


          //successHandler(token, user);

          if (this.isAdmin()) {
              this.router.navigate(['admin']);
          }
          if (this.isAuthor()) {
              this.router.navigate(['author']);
          }
          return true;
      } else {
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
