import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  @Output() close = new EventEmitter<void>();
  

  firstName = '';
  lastName = '';
  email = ''; 
  password = '';
  confirmPassword = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.errorMessage = '';


    if (!this.email || !this.password || !this.firstName) {
      this.errorMessage = 'Пожалуйста, заполните все обязательные поля';
      return;
    }
    
    const hasNumber = /\d/.test(this.password);
    const hasLetter = /[a-zA-Z]/.test(this.password)

        if (this.password.length < 8 || !hasNumber || !hasLetter) {
        this.errorMessage = 'Пароль слишком простой! Минимум 8 символов, цифры и буквы.';
        return;}

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.isLoading = true;


    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Ошибка регистрации. Возможно, такой E-mail занят.';
      }
    });
  }
}