import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fanfic } from 'src/app/models/fanfics';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Genre } from 'src/app/models/genre';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchType: 'title' | 'genre' = 'title';
  searchQuery: string = '';
  selectedGenreID: string = '';
  fanfics: Fanfic[] = [];
  genres: Genre[] = [];
  searchResults: Fanfic[] = [];
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
    this.loadFanfics();
    this.loadGenres();
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
      }, error => {
        console.error("Ошибка при загрузке пользователей:", error);
      });
  }

  loadFanfics() {
    this.http.get<Fanfic[]>('http://localhost:3000/fanfic').subscribe({
      next: (data) => {
        this.fanfics = data;
      },
      error: (error) => {
        console.error('Ошибка загрузки фанфиков:', error);
      }
    });
  }

  loadGenres() {
    this.http.get<Genre[]>('http://localhost:3000/genres').subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (error) => {
        console.error('Ошибка загрузки жанров:', error);
      }
    });
  }

  searchByTitle() {
    const query = this.searchQuery.toLowerCase();
    this.searchResults = this.fanfics.filter(f => f.name.toLowerCase().includes(query));
  }

  searchByGenre() {
    const genreID = Number(this.selectedGenreID);
    this.searchResults = this.fanfics.filter(f => {
      if (Array.isArray(f.genreID)) {
        return f.genreID.includes(genreID);
      }
      return false;
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToUserPage() {
    this.router.navigate(['/userpage/:id']);
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }

  goToBlogsPage() {
    this.router.navigate(['/blogs']);
  }

  goToReadComponent(fanficId: number) {
    this.router.navigate(['/fanfic', fanficId]);
  }

  goToBlogComponent(postId: number) {
    this.router.navigate(['/posts', postId]);
  }
}
