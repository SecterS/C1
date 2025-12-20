import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
  OnInit 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { AddTask } from '../add-task/add-task';
import { TodayTasks } from '../today-tasks/today-tasks'; 
import { Settings } from '../../settings/settings'; 
import { TaskService, Task } from '../../services/task.service';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AddTask, TodayTasks, Settings], 
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Home implements AfterViewInit, OnInit {

  @ViewChild('calendarContainer')
  calendarContainer!: ElementRef<HTMLElement>;

  // Модалки
  isAddTaskOpen = false;
  taskToEdit: Task | null = null;
  initialDate: string = '';

  isTodayOpen = false;
  isSettingsOpen = false;
  isDayViewOpen = false;
  
  selectedDayDate: Date | null = null;
  selectedDayTasks: Task[] = [];

  addTaskStyle: { [k: string]: any } = {};
  
  tasks: Task[] = [];
  viewDate: Date = new Date(); 
  calendarDays: CalendarDay[] = []; 
  activeFilter: string = 'all';


  currentUser = {
    name: 'Suganov Peter',
    role: 'Pro Plan',
    avatarColor: 'linear-gradient(135deg, #5865f2, #9b59b6)'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }


      this.taskService.getTasks().subscribe(data => {
        this.tasks = data;
      });
    }
    this.generateCalendar();
  }

  ngAfterViewInit(): void {}

  // --- ГЛАВНАЯ ЛОГИКА ОТОБРАЖЕНИЯ ЗАДАЧ ---

  getTasksForDay(day: CalendarDay): Task[] {
    let dayTasks = this.tasks.filter(task => {
      const tDate = new Date(task.date);

      return this.isSameDate(tDate, day.date);
    });

    if (this.activeFilter !== 'all') {
      dayTasks = dayTasks.filter(t => t.priority === this.activeFilter);
    }

    const weights: any = { 'high': 3, 'medium': 2, 'low': 1 };
    
    return dayTasks.sort((a, b) => {

      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return weights[b.priority] - weights[a.priority];
    });
  }

  getTaskColor(priority: string): string {
    switch (priority) {
      case 'high': return 'event--red';
      case 'medium': return 'event--orange';
      case 'low': return 'event--blue';
      default: return 'event--blue';
    }
  }

  setFilter(filter: string): void { this.activeFilter = filter; }
  onTaskClick(task: Task): void {}



  changeMonth(offset: number): void {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    this.viewDate = newDate;
    this.generateCalendar();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    let startDayOfWeek = firstDayOfMonth.getDay(); 
    if (startDayOfWeek === 0) startDayOfWeek = 7;
    startDayOfWeek -= 1; 

    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, lastDayOfPrevMonth - i);
      this.calendarDays.push({
        date: d, 
        dayNumber: d.getDate(),
        isCurrentMonth: false, 
        isToday: false, 
        isWeekend: this.isWeekend(d)
      });
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      this.calendarDays.push({
        date: d, 
        dayNumber: i,
        isCurrentMonth: true, 
        isToday: this.isSameDate(d, today), 
        isWeekend: this.isWeekend(d)
      });
    }


    const remainingCells = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      this.calendarDays.push({
        date: d, 
        dayNumber: i,
        isCurrentMonth: false, 
        isToday: false, 
        isWeekend: this.isWeekend(d)
      });
    }
  }

  private isWeekend(d: Date): boolean { const day = d.getDay(); return day === 0 || day === 6; }
  private isSameDate(d1: Date, d2: Date): boolean { return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); }

  // --- МОДАЛКИ ---

  openAddTask(date?: Date): void { 
    this.taskToEdit = null;
    if (date) this.initialDate = date.toISOString();
    else this.initialDate = '';
    this.syncAddTaskSize(); 
    this.isAddTaskOpen = true; 
  }

  openEditTask(task: Task): void {
    this.taskToEdit = task;
    this.isDayViewOpen = false;
    this.syncAddTaskSize();
    this.isAddTaskOpen = true;
  }

  closeAddTask(): void { this.isAddTaskOpen = false; this.taskToEdit = null; this.initialDate = ''; }
  
onTaskSaved(taskData: any): void {

    if (taskData.id) {
      this.taskService.updateTask(taskData).subscribe(() => {

        this.tasks = this.tasks.map(t => t.id === taskData.id ? taskData : t);
        this.closeAddTask();
      });
    } 

    else {
      this.taskService.addTask(taskData).subscribe(newTask => {

        this.tasks = [...this.tasks, newTask];
        this.closeAddTask();
      });
    }
  }

  onDeleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.selectedDayTasks = this.selectedDayTasks.filter(t => t.id !== task.id);
      });
    }
  }

  openDayView(day: CalendarDay): void {
    this.selectedDayDate = day.date;
    this.selectedDayTasks = this.tasks.filter(task => {
      const tDate = new Date(task.date);
      return this.isSameDate(tDate, day.date);
    });
    const weights: any = { 'high': 3, 'medium': 2, 'low': 1 };
    this.selectedDayTasks.sort((a, b) => weights[b.priority] - weights[a.priority]);
    this.isDayViewOpen = true;
  }
  closeDayView(): void { this.isDayViewOpen = false; }

  openToday(): void { this.isTodayOpen = true; }
  closeToday(): void { this.isTodayOpen = false; }
  openSettings(): void { this.isSettingsOpen = true; }
  closeSettings(): void { this.isSettingsOpen = false; }
  
  onLogout(): void { 
    if (confirm('Вы уверены, что хотите выйти?')) { 
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('user');
      }
      this.router.navigate(['/auth/login']); 
    } 
  }

  private syncAddTaskSize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.calendarContainer?.nativeElement) return;
    const r = this.calendarContainer.nativeElement.getBoundingClientRect();
    this.addTaskStyle = {
      position: 'fixed', left: `${r.left}px`, top: `${r.top}px`,
      width: `${r.width}px`, height: `${r.height}px`,
    };
  }
  @HostListener('window:resize')
  onResize(): void { if (this.isAddTaskOpen) this.syncAddTaskSize(); }
}