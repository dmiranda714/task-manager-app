import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskTableComponent } from './task-table/task-table.component';


const routes: Routes = [
  { path: '', redirectTo: '/AddTask', pathMatch: 'full' },
  { path: 'ViewTasks', component: TaskListComponent },
  { path: 'AddTask', component: TaskFormComponent },
  { path: 'EditTask/:id', component: TaskFormComponent},
  { path: 'ViewTable', component: TaskTableComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
