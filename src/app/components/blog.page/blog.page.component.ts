import { Component, OnInit, ElementRef } from '@angular/core';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-blog.page',
  templateUrl: './blog.page.component.html',
  styleUrls: ['./blog.page.component.css']
})
export class BlogPageComponent implements OnInit {
  post: Post | null = null;
  postID: number;
  userID: number;
  authorName: string | null = null;
  Users: Map<number, string> = new Map();
  isLoggedIn = false;
  fontSize: number = 18;

  constructor(private baseService: BaseServiceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private elRef: ElementRef) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.loadUsers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.postID = Number(idParam);
      console.log("Post ID:", this.postID);
  }
  this.baseService.getPostById(this.postID).subscribe({
    next: (data) => {
      this.post = data;
      this.setAuthorName();
    },
    error: (error) => {
      console.error("Ошибка при загрузке поста:", error);
    },
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

setAuthorName() {
  if (this.post && this.post.userID) {
    this.authorName = this.Users.get(this.post.userID) || null;
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
  const textElement = this.elRef.nativeElement.querySelector("#post-text");
  if (textElement) {
    textElement.style.fontSize = `${this.fontSize}px`;
  }
}

goToHome() {
  this.router.navigate(['/home']);
}

goToUserPage() {
  if (this.userID) {
    this.router.navigate([`/userpage/${this.userID}`]);
  } else {
    console.error("User ID не найден");
  }
}

goToMenu() {
  this.router.navigate(['/menu']);
}
}

