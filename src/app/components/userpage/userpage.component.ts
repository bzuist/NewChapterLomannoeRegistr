import { Bookshelf } from './../../models/bookshelf';
import { Post } from 'src/app/models/post';
import { Component, OnInit } from '@angular/core';
import { Fanfic } from 'src/app/models/fanfics';
import { User } from './../../models/user';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ReadComponentComponent } from '../read.component/read.component.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogEditWrapperComponent } from '../fanfic-editor/dialog-edit-wrapper/dialog-edit-wrapper.component';
import { DialogDeleteWrapperComponent } from '../fanfic-editor/dialog-delete-wrapper/dialog-delete-wrapper.component';
import { PostComment } from 'src/app/models/postcomment';
import { BookComment } from 'src/app/models/bookcomment';
import { Genre } from 'src/app/models/genre';


@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  fanfics: Fanfic[] = [];
  user: User;
  bookshelf: Bookshelf[] = [];
  posts: Post[] = [];
  id: number = 0;
  username: string = '';

  constructor(
    private baseService: BaseServiceService,
    private route: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser().then(() => {
      this.id = Number(this.activatedRoute.snapshot.paramMap.get('id')) || 0;
      if (this.id > 0) {
        this.loadUserData(this.id).then(() => {
          if (this.user?.username) {
            this.loadUserFanfics(this.user.username);
            this.loadUserPosts(this.user.username);
          }
        });
      } else {
        console.error("Ошибка: Неверный ID пользователя.");
      }
    });
  }

  loadUserData(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.baseService.getUserById(userId).subscribe(
        (data: User) => {
          this.user = data;
          resolve();
        },
        (error) => {
          console.error('Ошибка загрузки пользователя:', error);
          reject(error);
        }
      );
    });
  }

  getCurrentUser(): Promise<void> {
    return new Promise((resolve) => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn("Токен не найден в LocalStorage.");
        return resolve();
      }

      const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });

      this.http.get<User>('http://localhost:3000/users', { headers })
        .subscribe({
          next: (user) => {
            this.user = user;
            this.username = user.username;
            resolve();
          },
          error: (error) => {
            console.error("Ошибка загрузки пользователя:", error);
            resolve();
          }
        });
    });
  }

  loadUserFanfics(username: string): void {
    this.http.get<Fanfic[]>(`http://localhost:3000/fanfic?author=${username}`).subscribe({
      next: data => this.fanfics = data,
      error: error => {
        console.error('Ошибка при загрузке фанфиков:', error);
        this.fanfics = [];
      }
    });
  }

  loadUserPosts(username: string): void {
    console.log(`Запрос постов пользователя: ${username}`);

    this.http.get<Post[]>(`http://localhost:3000/posts?userID=${this.user.id}`).subscribe({
      next: data => {
        console.log("Загруженные посты:", data);
        this.posts = data;
      },
      error: error => {
        console.error('Ошибка при загрузке постов:', error);
        this.posts = [];
      }
    });
  }

  navigateToPost(postId: number): void {
    if (postId) {
      this.route.navigate(['/post', postId]);
    } else {
      console.error("Ошибка: Неверный ID поста.");
    }
  }

  openFanficDialog(fanficId: number): void {
    this.dialog.open(ReadComponentComponent, {
      data: { fanficId }
    });
  }

  editFanfic(fanfic: Fanfic): void {
    this.dialog.open(DialogEditWrapperComponent, {
      data: { fanfic }
    });
  }

  deleteFanfic(fanficId: number): void {
    this.dialog.open(DialogDeleteWrapperComponent, {
      data: { fanficId }
    });
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
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
    this.router.navigate(['/blogs', postId]);
  }
}
