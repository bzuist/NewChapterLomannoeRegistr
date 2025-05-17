import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userId: number;
  isLoggedIn = false;
  constructor(private router: Router, private authservice: AuthService) { }
  selectedPrice: number | null = null;

  proceedPayment() {
    if (!this.selectedPrice) {
      alert('Пожалуйста, выберите срок подписки.');
      return;
    }

    alert(`Вы выбрали подписку за ${this.selectedPrice} ₽`);
  }

  ngOnInit(): void {
    const auth = localStorage.getItem('auth');
    if (auth) this.isLoggedIn = true;
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
