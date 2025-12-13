import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

interface BackendItem {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: number; 
  category: number; 
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5035/api/todo';

  constructor(private http: HttpClient) {}


  getTasks(): Observable<Task[]> {
    return this.http.get<BackendItem[]>(this.apiUrl).pipe(

      map(items => items.map(item => this.mapToFrontend(item)))
    );
  }


  addTask(task: any): Observable<Task> {
    const backendData = this.mapToBackend(task);
    return this.http.post<BackendItem>(this.apiUrl, backendData).pipe(
      map(item => this.mapToFrontend(item))
    );
  }

  updateTask(task: Task): Observable<void> {
    const backendData = this.mapToBackend(task);

    return this.http.put<void>(`${this.apiUrl}/${task.id}`, backendData);
  }


  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  private mapToFrontend(item: BackendItem): Task {
    let p: 'low'|'medium'|'high' = 'low';
    if (item.priority === 3) p = 'high';
    if (item.priority === 2) p = 'medium';

 
    let c: 'work'|'study'|'personal' = 'personal';
    if (item.category === 1) c = 'work';
    if (item.category === 2) c = 'personal'; 
    if (item.category === 3) c = 'study';

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.dueDate ? item.dueDate : new Date().toISOString(),
      priority: p,
      category: c,
      isDone: item.isCompleted
    };
  }

  
  private mapToBackend(task: any): any {
    let p = 1;
    if (task.priority === 'high') p = 3;
    if (task.priority === 'medium') p = 2;

    let c = 2; 
    if (task.category === 'work') c = 1;
    if (task.category === 'study') c = 3;

    return {
      id: task.id || 0,
      title: task.title,
      description: task.description || '',
      dueDate: task.date,
      priority: p,
      category: c,
      isCompleted: task.isDone,
      hasReminder: false
    };
  }
}