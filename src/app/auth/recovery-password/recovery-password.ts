
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recovery-password.html',
  styleUrls: ['./recovery-password.scss']
})
export class RecoveryPassword {
  constructor(private router: Router) {
    console.log('RecoveryPassword загружен');
  }
  onSendCode() {
  console.log('Переход на страницу подтверждения...');
  this.router.navigate(['/confirm']).then(result => {
    console.log('Результат навигации:', result);
  }).catch(err => {
    console.error('Ошибка при переходе:', err);
  });
}

  goBack() {
    this.router.navigate(['/login']);
  }
  
}

