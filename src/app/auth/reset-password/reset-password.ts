import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPassword {
  password = '';
  confirmPassword = '';
  error = '';
  isLoading = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.error = '';

    if (!this.password || !this.confirmPassword) {
      this.error = 'Заполните все поля';
      return;
    }

    const hasNumber = /\d/.test(this.password);
    const hasLetter = /[a-zA-Z]/.test(this.password);

    if (this.password.length < 8 || !hasNumber || !hasLetter) {
        this.error = 'Пароль должен быть сложнее (8+ символов, цифры, буквы)';
        return;
    }

    if (this.password.length < 8) {
      this.error = 'Пароль должен быть не менее 8 символов';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Пароли не совпадают';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      alert('Пароль успешно изменён! Теперь вы можете войти.');
      this.router.navigate(['/auth/login']);
    }, 1500);
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }
}