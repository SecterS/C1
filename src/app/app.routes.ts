import { Routes } from '@angular/router';
import { Home } from './home/home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { RecoveryPassword } from './auth/recovery-password/recovery-password';
import { RecoveryConfirm } from './auth/recovery-confirm/recovery-confirm';
import { ResetPassword } from './auth/reset-password/reset-password';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'home', component: Home },
  

  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'auth/recovery', component: RecoveryPassword },
  { path: 'auth/recovery-confirm', component: RecoveryConfirm },
  { path: 'auth/reset-password', component: ResetPassword },


  { path: '**', redirectTo: 'auth/login' }
];