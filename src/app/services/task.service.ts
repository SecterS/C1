import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  date: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'study' | 'personal';
  reminder?: string;
  isDone: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storageKey = 'smart_todo_tasks';
  
  private tasks: Task[] = [
    { 
      id: 1, title: 'Приветствие', date: new Date().toISOString(), 
      priority: 'high', category: 'work', description: 'Добро пожаловать в SmartToDo!', isDone: false 
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.tasks = JSON.parse(saved);
      }
    }
  }

 
  private saveToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }
  }

  getTasks(): Observable<Task[]> {
    return of([...this.tasks]).pipe(delay(200));
  }

  addTask(task: Omit<Task, 'id' | 'isDone'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: Math.floor(Math.random() * 1000000),
      isDone: false
    };
    this.tasks.push(newTask);
    this.saveToStorage();
    return of(newTask).pipe(delay(200));
  }

  updateTask(updatedTask: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveToStorage(); 
    }
    return of(updatedTask).pipe(delay(200));
  }

  deleteTask(id: number): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
    return of(undefined).pipe(delay(200));
  }
}