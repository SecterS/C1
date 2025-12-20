import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss'
})
export class AddTask implements OnChanges {
  @Input() open = false;
  @Input() panelStyle: any = {};
  @Input() taskToEdit: any = null;
  @Input() preselectedDate: string = '';
  
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  title = '';
  description = '';
  date = '';
  priority = 'low';
  category = 'personal';
  reminder = 'none'; //
  
  errorText = ''; 

 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetForm();
    }
  }

   resetForm() {
    this.errorText = '';

    if (this.taskToEdit) {
     
      this.title = this.taskToEdit.title;
      this.description = this.taskToEdit.description;
      this.date = this.taskToEdit.date;
      this.priority = this.taskToEdit.priority;
      this.category = this.taskToEdit.category || 'personal';
      

      this.reminder = this.taskToEdit.reminder || 'none'; 

    } else {

      this.title = '';
      this.description = '';
      this.date = this.preselectedDate || new Date().toISOString().split('T')[0];
      this.priority = 'low';
      this.category = 'personal';
      

      this.reminder = 'none'; 
    }
  }

  close() {
    this.closed.emit();
  }

  save() {
   
    if (!this.title.trim()) {
      this.errorText = 'Нужно ввести название задачи!'; 
      return; 
    }

    const taskData = {
      id: this.taskToEdit ? this.taskToEdit.id : null,
      title: this.title,
      description: this.description,
      date: this.date,
      priority: this.priority,
      category: this.category,
      reminder: this.reminder,
       isDone: this.taskToEdit ? this.taskToEdit.isDone : false
    };

    this.saved.emit(taskData);
  }


  clearError() {
    this.errorText = '';
  }
}