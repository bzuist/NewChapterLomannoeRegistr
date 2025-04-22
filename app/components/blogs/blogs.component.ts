import { Post } from './../../models/post';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  Post: Post[] = [];
  Users: Map<number, string> = new Map();
  isLoggedIn = false;
  username: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const authToken = localStorage.getItem('authToken');
    this.isLoggedIn = !!authToken;

    if (this.isLoggedIn) {
      this.getCurrentUser().then(() => {
        this.username = localStorage.getItem('username');
      });
    }

    this.loadUsers();
  }

  getCurrentUser(): Promise<void> {
    return new Promise((resolve) => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return resolve();

      const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });

      this.http.get<User>('http://localhost:3000/users', { headers })
        .subscribe(user => {
          this.username = user.username;
          localStorage.setItem('username', user.username);
          resolve();
        }, error => {
          console.error("Ошибка загрузки пользователя:", error);
          resolve();
        });
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.username = null;
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
          } else {
            console.warn("Некорректный пользователь:", user);
          }
        });
        this.showRandomPosts();
      }, error => {
        console.error("Ошибка при загрузке пользователей:", error);
      });
  }
  showRandomPosts() {
    this.http.get<any[]>('http://localhost:3000/posts')
      .subscribe(response => {
        if (!Array.isArray(response)) {
          console.error('Ошибка: response не массив', response);
          return;
        }

        const randomPosts = response.sort(() => Math.random() - 0.5);
        this.Post = randomPosts.map(post => new Post(post, this.Users));
      }, error => {
        console.error('Ошибка при загрузке постов:', error);
      });
  }
  goToBlogComponent(postId: number | undefined) {
    if (!postId || isNaN(postId)) {
        console.error("Ошибка: postId не указан", postId);
        return;
    }
    this.router.navigate([`/posts/${postId}`]);
}
}
