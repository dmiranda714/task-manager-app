import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { TokenType } from '@angular/compiler';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core';

declare const gapi: any;
declare const google: any;


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit{
  
  username: string | null = '';
  userRole: string | null = '';
  tasks: Task[] = [];
  isSignedInGoogle = false;
  
  
  
  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private userService: UserService, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {
    const start = performance.now();
    console.log("Page load started");
    this.authService.signedIn$.subscribe(value => {
      this.isSignedInGoogle = value;
    })
    this.username = this.authService.getUsername();
    this.userRole = this.authService.getUserRole();
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        setTimeout(() => { 
          const end = performance.now(); console.log(`Page fully rendered in ${(end - start).toFixed(2)} ms`); 
        });
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }

  deleteTask(id: string) : void {
    if(!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
      },
      error: (err) => {
        console.error('Error Deleting tasks:', err)
      }
    })
  }

  toggleCompleted(task: Task): void {
    const updatedTask = {...task, completed: !task.completed};

    this.taskService.updateTaskStatus(updatedTask).subscribe({
      next: (res) => {
        task.completed = updatedTask.completed;
      },
      error: (err) => {
        console.error('Error updating task:', err);
      }
    })
  }

  filter: 'all' | 'completed' | 'incomplete' | 'low' | 'medium' | 'high' | 'past-due' | 'due-soon' = 'all';
  sortBy: 'none' | 'deadline-asc' | 'deadline-desc' | 'priority-low' | 'priority-high'  = 'none'

  get filteredTasks() {
  
  const priorityMap = {'low' : 1, 'medium' : 2, 'high' : 3}  
  let filtered = this.tasks;

  if(this.filter === 'completed') {
    filtered = this.tasks.filter(task => task.completed);
  } else if (this.filter === 'incomplete') {
    filtered = this.tasks.filter(task => !task.completed);
  } else if (this.filter === 'low') {
    filtered = this.tasks.filter(task => task.priority === 'low');
  } else if (this.filter === 'medium') {
    filtered = this.tasks.filter(task => task.priority === 'medium');
  } else if (this.filter === 'high') {
    filtered = this.tasks.filter(task => task.priority === 'high');
  } else if (this.filter === 'past-due') {
    filtered = this.tasks.filter(task => this.isOverdue(task));
  } else if (this.filter === 'due-soon') {
    filtered = this.tasks.filter(task => this.isDueSoon(task));
  }
  
  if(this.sortBy === 'deadline-asc') {
    filtered = filtered.slice().sort((a, b) => {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  } else if (this.sortBy === 'deadline-desc') {
    filtered = filtered.slice().sort((a, b) => {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    })
  } else if(this.sortBy === 'priority-low') {
    filtered = filtered.slice().sort((a,b) => {
      return priorityMap[a.priority] - priorityMap[b.priority]
    })
  } else if(this.sortBy === 'priority-high') {
    filtered = filtered.slice().sort((a,b) => {
      return priorityMap[b.priority] - priorityMap[a.priority]
    })
  }


  return filtered;
 
  };

  isOverdue(task: Task): boolean {
    return !!task.deadline && new Date(task.deadline) < new Date() && !task.completed;
  }

  isDueSoon(task: Task): boolean {
    if(!task.deadline || task.completed) return false;
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diff = deadline.getTime() - now.getTime();
    
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    return diff > 0 && diff <= threeDaysInMs;
  }

  async createCalendarEvent(task: any) {
    const Date = task.deadline.split('T')[0]; 

    const event = {
      summary: task.description,
      start: { date: Date },
      end:   { date: Date }
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary', 
        resource: event
      })
      console.log('Event Created', response);
      this.translate.get("CALENDAR_ADD").subscribe((translatedMsg: string) => {alert(translatedMsg);})
      task.calendarEventId = response.result.id;
    } catch (err) {
      console.error('Error creating event:', err);
      this.translate.get("CALENDAR_CREATE_ERROR").subscribe((translatedMsg: string) => {alert(translatedMsg);})
    }
  }

  deleteCalendarEvent(task: any) {
  this.translate.get('CALENDAR_DELETE_WARNING').subscribe((message: string) => {
    if (!confirm(message)) {
      return; 
    }

    if (!task.calendarEventId) {
      console.warn('No calendar event linked to this task');
      this.translate.get("CALENDAR_DUPLICATE").subscribe((translatedMsg: string) => { alert(translatedMsg); });
      return;
    }

    gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: task.calendarEventId
    }).then(() => {
      console.log("Event deleted from calendar");
      this.translate.get("CALENDAR_DELETE").subscribe((translatedMsg: string) => { alert(translatedMsg); });
      task.calendarEventId = null;
    }).catch((err: any) => {
      console.error('Error deleting event:', err);
      this.translate.get("CALENDAR_DELETE_ERROR").subscribe((translatedMsg: string) => { alert(translatedMsg); });
    });
  });
}

  logout() {
  this.authService.logout();
}

}
