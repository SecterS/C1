import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recovery-confirm.html',
  styleUrls: ['./recovery-confirm.scss']
})
export class RecoveryConfirm {
  code: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.error = '';

    if (!this.code.trim()) {
      this.error = 'Пожалуйста, введите код';
      return;
    }

    this.isLoading = true;


    setTimeout(() => {
      this.isLoading = false;

      this.router.navigate(['/auth/reset-password']);
    }, 1000);
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }
}