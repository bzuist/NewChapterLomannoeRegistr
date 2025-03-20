import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Fanfic } from 'src/app/models/fanfics';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private baseService: BaseServiceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.loadUsers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = Number(idParam);
      console.log("ReadComponent ID:", this.id);

      this.baseService.getFanficById(this.id).subscribe({
        next: (data) => {
          this.fanfic = data;
          this.setAuthorName();
        },
        error: (error) => {
          console.error("Ошибка при загрузке фанфика:", error);
        },
      });
    } else {
      console.error("Fanfic ID is null or undefined");
    }
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
}
