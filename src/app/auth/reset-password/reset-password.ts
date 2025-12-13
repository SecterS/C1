import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPassword {
  constructor(private router: Router) {
    console.log('ResetPassword загружен');
  }

  onSubmit() {
    console.log('Пароль успешно изменён!');
    this.router.navigate(['/login']);
  }

  onCancel() {
    console.log('Возврат на логин');
    this.router.navigate(['/login']);
  }
}
