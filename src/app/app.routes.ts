import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { RecoveryPassword } from './auth/recovery-password/recovery-password';
import { RecoveryConfirm } from './auth/recovery-confirm/recovery-confirm';
import { ResetPassword } from './auth/reset-password/reset-password';
import { Home } from './home/home/home'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'home', component: Home },                

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recovery', component: RecoveryPassword },
  { path: 'confirm', component: RecoveryConfirm },
  { path: 'reset-password', component: ResetPassword },

  { path: 'test', component: RecoveryPassword },

  { path: '**', redirectTo: 'login' },               
];
