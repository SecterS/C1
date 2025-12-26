import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './today-tasks.html',
  styleUrl: './today-tasks.scss'
})
export class TodayTasks {
  @Input() open = false;
  @Input() tasks: Task[] = []; 

  @Output() closed = new EventEmitter<void>();
  @Output() addNew = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  close() {
    this.closed.emit();
  }


  onAddNew() {
    this.addNew.emit();
  }

  toggleTask(task: Task) {
    task.isDone = !task.isDone;

    this.taskService.updateTask(task).subscribe({
      next: () => console.log('Updated'),
      error: (err) => {
        console.error(err);
        task.isDone = !task.isDone; 
      }
    });
  }


  get stats() {
    const total = this.tasks.length;
    const done = this.tasks.filter(t => t.isDone).length;
    const percent = total > 0 ? (done / total) * 100 : 0;
    
    return { total, done, percent };
  }


  get sortedTasks() {

    return [...this.tasks].sort((a, b) => {

      if (a.isDone === b.isDone) return 0;

      return a.isDone ? 1 : -1;
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#ef5350';   
      case 'medium': return '#ffa726'; 
      case 'low': return '#66bb6a';    
      default: return '#ccc';
    }
  }
}