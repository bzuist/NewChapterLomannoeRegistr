import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fanfic } from 'src/app/models/fanfics';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.css']
})
export class WorksComponent implements OnInit {
  Fanfic: Fanfic[] = [];
  Users: Map<number, string> = new Map();
  isLoggedIn = false;
  username: string | null = null;
  constructor(private http: HttpClient, private router: Router, private authservice: AuthService) { }

  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) this.isLoggedIn = true;
    this.loadUsers();
  }

  get LoggedUser(): CredentialResponse{
    const auth = localStorage.getItem('auth');
    if (!auth) return new CredentialResponse();
    return JSON.parse(auth) as CredentialResponse;
  }

  get userDisplayName(): string {
    return this.LoggedUser?.name || 'Неизвестный пользователь';
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToProfile() {
    const userId = this.LoggedUser?.userData?.id;
    if (userId) {
      this.router.navigate([`/userpage/${userId}`]);
    } else {
      console.error('ID пользователя не найден');
    }
  }

  loadUsers() {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? new HttpHeaders({ Authorization: `Bearer ${authToken}` }) : new HttpHeaders();

    this.http.get<User[]>('http://localhost:3000/users', { headers })
      .subscribe(users => {
        users.forEach(user => {
          const userID = Number(user.id) || user.userID;
          if (userID && user.username) {
            this.Users.set(userID, user.username);
          } else {
            console.warn("Некорректный пользователь:", user);
          }
        });
        this.showRandomBooks();
      }, error => {
        console.error("Ошибка при загрузке пользователей:", error);
      });
  }

  showRandomBooks() {
    if (this.Users.size === 0) return;

    this.http.get<any[]>('http://localhost:3000/fanfic')
      .subscribe(data => {
        if (!data || data.length === 0) {
          console.error('Ошибка: пустой ответ от сервера', data);
          return;
        }

        const randomFanfics = data.sort(() => Math.random() - 0.5);

        this.Fanfic = randomFanfics.map(fanfic => {
          const userID = Array.from(this.Users.entries()).find(([id, name]) => name === fanfic.author)?.[0] || 0;
          const authorLogin = this.Users.get(userID) || 'Неизвестный автор';

          return new Fanfic({ ...fanfic, userID, authorLogin }, this.Users);
        });
      });
    }

    decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
     }

    goToHome() {
      this.router.navigate(['/home']);
    }

    goToUserPage(userId: number) {
      if (userId) {
        this.router.navigate([`/userpage/${userId}`]);
      } else {
        console.error("Ошибка: userId не указан");
      }
    }

    goToMenu() {
      this.router.navigate(['/menu']);
    }

    goToReadComponent(fanficId: number) {
      if (fanficId) {
        this.router.navigate(['/fanfic', fanficId]);
      } else {
        console.error("Ошибка: fanficId не указан");
      }
    }
  }
