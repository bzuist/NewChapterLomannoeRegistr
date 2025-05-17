import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Fanfic } from 'src/app/models/fanfics';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';
import { Genre } from 'src/app/models/genre';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-read.component',
  templateUrl: 'read.component.component.html',
  styleUrls: ['./read.component.component.css'],
})
export class ReadComponentComponent implements OnInit {
  fanfic: Fanfic | null = null;
  id: number;
  userId: number;
  authorName: string | null = null;
  Users: Map<number, string> = new Map();
  isLoggedIn = false;
  fontSize: number = 18;
  genres: Genre[] = [];
  genreNames: string[] = [];

  constructor(
    private baseService: BaseServiceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private elRef: ElementRef,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) this.isLoggedIn = true;
    this.loadUsers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = Number(idParam);

      Promise.all([
        this.loadUsers(),
        this.loadGenres(),
        this.loadFanfic(this.id)
      ]).then(() => {
        this.setAuthorName();
        this.setGenreNames();
      }).catch(error => {
        console.error("Ошибка при инициализации:", error);
      });

    } else {
      console.error("Fanfic ID is null or undefined");
    }
  }

  loadFanfic(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.baseService.getFanficById(id).subscribe({
        next: (data) => {
          this.fanfic = data;
          console.log("Загружен фанфик:", this.fanfic);
          resolve();
        },
        error: (error) => {
          console.error("Ошибка при загрузке фанфика:", error);
          reject(error);
        }
      });
    });
  }


  loadUsers() {
    this.http.get<User[]>('http://localhost:3000/users')
      .subscribe({
        next: (users: User[]) => {
          console.log("Полученные пользователи:", users);
          users.forEach((user: User) => {
            const userID = Number(user.id) || user.userID;
            if (userID && user.username) {
              this.Users.set(userID, user.username);
            } else {
              console.warn("Некорректный пользователь:", user);
            }
          });
          console.log("Карта пользователей:", this.Users);
        },
        error: (error) => {
          console.error("Ошибка загрузки пользователей:", error);
        },
      });
  }

  loadGenres() {
    this.http.get<Genre[]>('http://localhost:3000/genres').subscribe({
      next: (data) => {
        this.genres = data;
        this.setGenreNames();
      },
      error: (error) => {
        console.error("Ошибка при загрузке жанров:", error);
      }
    });
  }

  setGenreNames() {
    console.log("fanfic.genreID:", this.fanfic?.genreID);
    if (this.fanfic && this.genres.length > 0) {
      let ids: number[] = [];

      if (Array.isArray(this.fanfic.genreID)) {
        ids = this.fanfic.genreID;
      }

      this.genreNames = this.genres
      .filter(g => ids.includes(Number(g.genreID)))
      .map(g => g.genre);

      console.log("Жанры этого фанфика:", this.genreNames);
    }
  }

  setAuthorName() {
    if (this.fanfic && this.fanfic.userID) {
      this.authorName = this.Users.get(this.fanfic.userID) || null;
    }
  }

  increaseFontSize() {
    this.fontSize += 2;
    this.applyFontSize();
  }

  decreaseFontSize() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      this.applyFontSize();
    }
  }

  applyFontSize() {
    const textElement = this.elRef.nativeElement.querySelector("#fanficText");
    if (textElement) {
      textElement.style.fontSize = `${this.fontSize}px`;
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToUserPage() {
    if (this.userId) {
      this.router.navigate([`/userpage/${this.userId}`]);
    } else {
      console.error("User ID не найден");
    }
  }

  goToMenu() {
    this.router.navigate(['/menu']);
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
  
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
     }
}

