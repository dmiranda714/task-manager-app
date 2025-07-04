import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit{
  
  tasks: Task[] = [];
  
  constructor(private taskService: TaskService, private router: Router) {

  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    })
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

  logout() {
  if (confirm('Are you sure you want to log out?')) {
    localStorage.clear();
    alert('Logged out successfully.');
    this.router.navigate(['/login']);
  }
}

}
