import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Register, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  showRegister = false;

  constructor(private router: Router) {}

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    event.preventDefault(); 
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)?.value ?? '';
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value ?? '';

   
    
    if (username.trim() && password.trim()) {
   
      localStorage.setItem('mock_token', 'ok');
      this.router.navigateByUrl('/home');
      return;
    }

    alert('Введите логин и пароль');
  }


  showRegisterModal() {
    this.showRegister = true;
  }

  hideRegisterModal() {
    this.showRegister = false;
  }

  onRegisterSuccess() {
    this.showRegister = false;
    alert('Регистрация прошла успешно!');
  }
}
