import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userId: number;
  constructor(private router: Router ) { }
  selectedPrice: number | null = null;

  proceedPayment() {
    if (!this.selectedPrice) {
      alert('Пожалуйста, выберите срок подписки.');
      return;
    }

    alert(`Вы выбрали подписку за ${this.selectedPrice} ₽`);
  }

  ngOnInit(): void {
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
