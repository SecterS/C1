import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Register } from '../register/register';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Register, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  showRegister = false;
  
  username = '';
  password = '';
  
  error = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Введите логин и пароль';
      return;
    }

    this.isLoading = true;

    if (this.authService.login(this.username, this.password)) {
        this.router.navigate(['/home']);
    } else {
      this.error = 'Произошла непредвиденная ошибка';
    }
    
    this.isLoading = false;
  }

  showRegisterModal() {
    this.showRegister = true;
  }

  hideRegisterModal() {
    this.showRegister = false;
  }

  onRegisterSuccess() {
    this.showRegister = false;
  }
}