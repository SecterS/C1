import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './recovery-password.html',
  styleUrls: ['./recovery-password.scss']
})
export class RecoveryPassword {
  email: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSendCode() {
    this.error = '';

    if (!this.email.trim()) {
      this.error = 'Пожалуйста, введите Email';
      return;
    }

    if (!this.email.includes('@')) {
      this.error = 'Некорректный формат E-mail';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      console.log(`Код отправлен на ${this.email}`);

      this.router.navigate(['/auth/recovery-confirm']); 
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}