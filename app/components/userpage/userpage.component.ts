import { Fanfic } from './../../models/fanfics';
import { Bookshelf } from './../../models/bookshelf';
import { Post } from 'src/app/models/post';
import { Component, OnInit } from '@angular/core';
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
import { DialogChangeWrapperComponent } from '../fanfic-editor/dialog-change-wrapper/dialog-change-wrapper.component';
import { DialogAddPostWrapperComponent } from '../post-editor/dialog-add-post-wrapper/dialog-add-post-wrapper/dialog-add-post-wrapper.component';
import { DialogChangePostWrapperComponent } from '../post-editor/dialog-change-post-wrapper/dialog-change-post-wrapper.component';
import { DialogDeletePostWrapperComponent } from '../post-editor/dialog-delete-post-wrapper/dialog-delete-post-wrapper/dialog-delete-post-wrapper.component';
import { UserpageSettingsComponent } from '../dialog-edit-profile-wrapper.component/userpage.settings.component';

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

  addFanfic(): void {
    this.http.get<Genre[]>('http://localhost:3000/genres').subscribe({
      next: (genres) => {
        const dialogRef = this.dialog.open(DialogEditWrapperComponent, {
          data: { fanfic: null, genres }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Новый фанфик:', result);
            this.http.post<Fanfic>('http://localhost:3000/fanfics', result)
              .subscribe({
                next: newFanfic => {
                  console.log("Фанфик успешно добавлен на сервер:", newFanfic);
                  this.fanfics.push(newFanfic);
                },
                error: error => console.error("Ошибка при добавлении фанфика:", error)
              });
          }
        });
      },
      error: (error) => {
        console.error("Ошибка загрузки жанров:", error);
      }
    });
  }

  addPost(): void {
    this.http.get<Genre[]>('http://localhost:3000/genres').subscribe({
      next: (genres) => {
        const dialogRef = this.dialog.open(DialogChangeWrapperComponent, {
          data: { fanfic: null, genres }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Новый фанфик:', result);
            this.http.post<Fanfic>('http://localhost:3000/posts', result)
              .subscribe({
                next: newFanfic => {
                  console.log("Фанфик успешно добавлен на сервер:", newFanfic);
                  this.fanfics.push(newFanfic);
                },
                error: error => console.error("Ошибка при добавлении фанфика:", error)
              });
          }
        });
      },
      error: (error) => {
        console.error("Ошибка загрузки жанров:", error);
      }
    });
  }


  changeFanfic(fanficId: number): void {
    const fanfic = this.fanfics.find(f => f.id === fanficId);

    if (fanfic) {
        this.http.get<Genre[]>('http://localhost:3000/genres').subscribe({
            next: (genres) => {
                const dialogRef = this.dialog.open(DialogChangeWrapperComponent, {
                    data: { fanfic, genres }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        console.log('Сохранённые данные фанфика:', result);
                        this.http.put<Fanfic>(`http://localhost:3000/fanfic/${fanficId}`, result)
                            .subscribe({
                                next: updatedFanfic => {
                                    console.log("Фанфик успешно обновлен на сервере:", updatedFanfic);
                                    Object.assign(fanfic, updatedFanfic);
                                },
                                error: error => console.error("Ошибка при обновлении фанфика:", error)
                            });
                    }
                });
            },
            error: (error) => {
                console.error("Ошибка загрузки жанров:", error);
            }
        });
    } else {
        console.error("Фанфик с таким ID не найден.");
    }
}

deleteFanfic(fanficId: number): void {
  const fanfic = this.fanfics.find(f => f.id === fanficId);
  const dialogRef = this.dialog.open(DialogDeleteWrapperComponent, {
    data: { fanficId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Удаление подтверждено, отправляем запрос на сервер');
      this.http.delete(`http://localhost:3000/fanfic/${fanficId}`).subscribe({
        next: (response) => {
          console.log('Работа успешно удалена', response);
        },
        error: (error) => {
          console.error('Ошибка при удалении работы:', error);
          alert('Ошибка при удалении работы. Пожалуйста, попробуйте снова.');
        }
      });
    } else {
      console.log('Удаление отменено пользователем');
    }
  });
}


  changePost(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const dialogRef = this.dialog.open(DialogChangePostWrapperComponent, {
        data: { post }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Сохранённые данные поста:', result);
          this.http.put<Post>(`http://localhost:3000/posts/${postId}`, result)
            .subscribe({
              next: updatedPost => {
                console.log("Пост успешно обновлен на сервере:", updatedPost);
                Object.assign(post, updatedPost);
              },
              error: error => console.error("Ошибка при обновлении поста:", error)
            });
        }
      });
    } else {
      console.error("Пост с таким ID не найден.");
    }
  }



  deletePost(postId: number): void {
    const dialogRef = this.dialog.open(DialogDeletePostWrapperComponent, {
      data: { postId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Post with ID ${postId} successfully deleted`);
        this.http.delete(`http://localhost:3000/posts/${postId}`).subscribe(
          response => {
            console.log('Пост успешно удален:', response);
          },
          error => {
            console.error('Ошибка при удалении поста:', error);
          }
        );
      } else {
        console.log('Пост не был удален');
      }
    });
  }

  editProfile(): void {
    const dialogRef = this.dialog.open(UserpageSettingsComponent, {
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put<User>(`http://localhost:3000/users/${this.user.id}`, result).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            console.log('Профиль успешно обновлен:', updatedUser);
          },
          error: (error) => {
            console.error('Ошибка при обновлении профиля:', error);
          }
        });
      } else {
        console.log('Редактирование профиля отменено');
      }
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
