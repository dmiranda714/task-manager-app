import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiURL = 'http://localhost:3000/api/todoapp/'

  constructor(private http: HttpClient) {

   }

   getUserId(): string {
    return localStorage.getItem('userId') || '';
   }

   getUserRole(): string {
    return localStorage.getItem('userRole') || '';
   }

   addTask(task: Task): Observable<void>{
    return this.http.post<void>(this.apiURL+'AddTask', task);
   }

   getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(`${this.apiURL}GetTasks`);
   }

   updateTaskStatus(task: Task): Observable<any> {
    return this.http.put(this.apiURL+`UpdateTask/${task._id}`, {
      completed: task.completed
    })
   }

   deleteTask(id: string): Observable<any> {
    return this.http.delete(this.apiURL+`DeleteTask/${id}`);
   }

   getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(this.apiURL+`GetTask/${id}`);
   }

   updateTask(id: string, task:Task): Observable<any> {
    return this.http.put(this.apiURL+`UpdateTask/${id}`, task);
   }
}
