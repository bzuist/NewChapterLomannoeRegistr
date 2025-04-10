import { Credential } from 'src/app/models/auth/Credential';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorAuth: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.clearLoginData();
    this.authService.logoutWithoutRedirect();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const credentials: Credential = this.loginForm.value;

      this.authService.authenticate(
        credentials,
        () => {
          console.error('Ошибка: Некорректные данные пользователя или аутентификация не удалась.');
          this.errorAuth = true;
        }
      );
    } else {
      console.warn('Форма логина недействительна');
      this.errorAuth = true;
    }
  }


  goToRegistration() {
    this.router.navigate(['/registration']);
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
