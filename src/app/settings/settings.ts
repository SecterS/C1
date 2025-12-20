import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  notifications = true;
  showCompleted = true;
  email = 'alex@design.pro';

  close() {
    this.closed.emit();
  }
}