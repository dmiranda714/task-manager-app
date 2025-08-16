import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ViewTasks', component: TaskListComponent, canActivate: [authGuard]},
  { path: 'AddTask', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'EditTask/:id', component: TaskFormComponent, canActivate: [authGuard]},
  { path: 'ViewTable', component: TaskTableComponent, canActivate: [authGuard]}, 
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
