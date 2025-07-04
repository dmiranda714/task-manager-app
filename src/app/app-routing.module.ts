import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ViewTasks', component: TaskListComponent },
  { path: 'AddTask', component: TaskFormComponent },
  { path: 'EditTask/:id', component: TaskFormComponent},
  { path: 'ViewTable', component: TaskTableComponent}, 
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
