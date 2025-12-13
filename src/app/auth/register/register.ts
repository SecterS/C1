import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.success.emit();
  }
}
