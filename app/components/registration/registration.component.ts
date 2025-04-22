import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ROLE, ROLE_MAPPER } from '../../auth/auth role';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Fanfic } from 'src/app/models/fanfics';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  registrationError: string | null = null;
  usernameTakenError: string | null = null;
  apiUrl = 'http://localhost:3000/users';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      adminCode: ['']
    }, { validators: this.conditionalPasswordMatchValidator });
  }

  conditionalPasswordMatchValidator(form: FormGroup) {
    if (!form || !form.controls) return null;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { username, password, adminCode } = this.registrationForm.value;

      // Проверяем, занято ли имя пользователя
      this.checkUsernameExists(username).subscribe({
        next: (isTaken) => {
          if (isTaken) {
            this.usernameTakenError = 'Это имя пользователя уже занято.';
          } else {
            // Если имя не занято, продолжаем регистрацию
            const role = adminCode === 'ADMIN123' ? ROLE.SUPER_USER : ROLE.AUTHOR;

            this.http.post(this.apiUrl, { username, password, role }).subscribe({
              next: () => {
                console.log('Регистрация успешна!');
                this.registrationError = null;
                this.usernameTakenError = null;
                this.registrationForm.reset();
              },
              error: (err: HttpErrorResponse) => {
                this.registrationError = `Ошибка регистрации: ${err.error.message || err.message}`;
              }
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.registrationError = `Ошибка проверки имени пользователя: ${err.message}`;
        }
      });
    } else {
      this.registrationError = 'Пожалуйста, исправьте ошибки в форме.';
    }
  }

  checkUsernameExists(username: string) {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`).pipe(
      map((response) => response.length > 0)
    );
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }

  goToBlogsPage() {
    this.router.navigate(['/blogs']);
  }

  }


