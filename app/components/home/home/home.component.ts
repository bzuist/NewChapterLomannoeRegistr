import { AuthService } from 'src/app/auth/auth.service';
import { principal } from './../../../models/principal';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fanfic } from 'src/app/models/fanfics';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Fanfic: Fanfic[] = [];
  post: Post[] = [];
  Users: Map<number, string> = new Map();
  isLoggedIn = false;
  username: string | null = null;

  constructor(private http: HttpClient, private router: Router, private authservice: AuthService) {}

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

  loadUsers() {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? new HttpHeaders({ Authorization: `Bearer ${authToken}` }) : new HttpHeaders();

    this.http.get<User[]>('http://localhost:3000/users', { headers })
      .subscribe(users => {
        users.forEach(user => {
          const userID = Number(user.id) || user.userID;
          if (userID && user.username) {
            this.Users.set(userID, user.username);
          }
        });
        this.showRandomBooks();
        this.showRandomPosts();
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

        const randomFanfics = data.sort(() => Math.random() - 0.5).slice(0, 10);

        this.Fanfic = randomFanfics.map(fanfic => {
          const userID = Array.from(this.Users.entries()).find(([id, name]) => name === fanfic.author)?.[0] || 0;
          const authorLogin = this.Users.get(userID) || 'Неизвестный автор';

          return new Fanfic({ ...fanfic, userID, authorLogin }, this.Users);
        });
      });
  }

  showRandomPosts() {
    this.http.get<any[]>('http://localhost:3000/posts')
      .subscribe(response => {
        if (!Array.isArray(response)) {
          console.error('Ошибка: response не массив', response);
          return;
        }

        const randomPosts = response.sort(() => Math.random() - 0.5).slice(0, 10);
        this.post = randomPosts.map(post => new Post(post, this.Users));
      }, error => {
        console.error('Ошибка при загрузке постов:', error);
      });
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

  goToReadComponent(fanficId: number) {
    if (fanficId) {
      this.router.navigate(['/fanfic', fanficId]);
    } else {
      console.error("Ошибка: fanficId не указан");
    }
  }

  goToBlogComponent(postId: number | undefined) {
    if (!postId || isNaN(postId)) {
        console.error("Ошибка: postId не указан", postId);
        return;
    }
    this.router.navigate([`/posts/${postId}`]);
}
}
