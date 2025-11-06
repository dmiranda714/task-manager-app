import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})

export class TaskFormComponent implements OnInit {

  taskForm: FormGroup = new FormGroup({});


  constructor( 
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService

  ) {

  }

  ngOnInit(): void {
   this.taskForm = this.formBuilder.group({
    description: ['', Validators.required],
      deadline: ['', Validators.required],
      priority: ['', Validators.required]
   })

   let taskId = this.activatedRoute.snapshot.paramMap.get('id');

  if(taskId) {
    this.taskService.getTaskById(taskId).subscribe(task => {
      if(task)
      this.taskForm.patchValue({
        description: task.description,
        deadline: new Date(task.deadline).toISOString().slice(0, 10),
        priority: task.priority
    })
    
    })
  }
  }

  onSubmit(): void {
  if (this.taskForm.valid) {
    const userId = this.taskService.getUserId();
    const task: Task = {
      ...this.taskForm.value, 
      userId };
    const taskId = this.activatedRoute.snapshot.paramMap.get('id');

    if (taskId) {
      
      this.taskService.updateTask(taskId, task).subscribe({
        next: () => {
          alert('Task updated!');
          this.router.navigate(['/ViewTasks']);
        },
        error: () => {
          alert('Failed to update task');
        }
      });
    } else {
      
      this.taskService.addTask(task).subscribe({
        next: () => {
          alert('Task added!');
          this.router.navigate(['/ViewTasks']);
        },
        error: () => {
          alert('Failed to add task');
        }
      });
    }
  }
}

logout() {
  this.authService.logout();
}
    

}
