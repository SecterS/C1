import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.scss']
})
export class AddTask {
  @Input() open = false;
  @Input() panelStyle: { [k: string]: any } = {};

  @Input() taskToEdit: Task | null = null;
  
  @Input() preselectedDate: string = ''; 
  
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  close() {
    this.closed.emit();
  }

  save(title: string, date: string, desc: string, priority: string, category: string, reminder: string) {
    if (!title.trim()) {
      alert('Please enter a task name');
      return;
    }

    let finalDate = date;
    

    if (!finalDate) {
      if (this.preselectedDate) {
        const d = new Date(this.preselectedDate);
        const now = new Date();
        d.setHours(now.getHours(), now.getMinutes());
        finalDate = d.toISOString();
      } else {
        finalDate = new Date().toISOString();
      }
    }

    const taskData = {
      title,
      date: finalDate,
      description: desc,
      priority,
      category,
      reminder,
      id: this.taskToEdit ? this.taskToEdit.id : null,
      isDone: this.taskToEdit ? this.taskToEdit.isDone : false
    };

    this.saved.emit(taskData);
  }

  getInputValue(): string {
    if (this.taskToEdit) {
      return this.formatDate(new Date(this.taskToEdit.date));
    }

    if (this.preselectedDate) {
      const d = new Date(this.preselectedDate);
      const now = new Date();
      d.setHours(now.getHours(), now.getMinutes());
      return this.formatDate(d);
    }
    return '';
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' + 
           pad(date.getMonth() + 1) + '-' + 
           pad(date.getDate()) + 'T' + 
           pad(date.getHours()) + ':' + 
           pad(date.getMinutes());
  }
}