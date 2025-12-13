import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recovery-confirm.html',  
  styleUrls: ['./recovery-confirm.scss'],  
})
export class RecoveryConfirm {
  code: string = '';

  constructor(private router: Router) {
    console.log('RecoveryConfirm загружен');
  }

  onSubmit() {
    console.log('Переход на reset-password');
    this.router.navigate(['/reset-password']);
  }

  onCancel() {
    console.log('Возврат на логин');
    this.router.navigate(['/login']);
  }
}