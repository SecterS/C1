import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../services/task.service'; 

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './today-tasks.html',
  styleUrls: ['./today-tasks.scss']
})
export class TodayTasks implements OnChanges {
  @Input() open = false;
  @Input() tasks: Task[] = [];
  
  @Output() closed = new EventEmitter<void>();
  @Output() addNew = new EventEmitter<void>(); 

  sortedTasks: Task[] = [];
  
  // Статистика
  stats = { total: 0, done: 0, percent: 0 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] || changes['open']) {
      this.updateView();
    }
  }

  close() {
    this.closed.emit();
  }


  onAddNew() {
    this.addNew.emit(); 
  }

  private updateView() {
    if (!this.tasks) return;

    this.stats.total = this.tasks.length;
    this.stats.done = this.tasks.filter(t => t.isDone).length;
    this.stats.percent = this.stats.total === 0 ? 0 : Math.round((this.stats.done / this.stats.total) * 100);

    this.sortedTasks = [...this.tasks].sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  toggleTask(task: Task) {
    task.isDone = !task.isDone;
    this.updateView();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#3b82f6';
      default: return '#ccc';
    }
  }
}