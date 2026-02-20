import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { InactivityService } from '../services/inactivity.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  // ---- MOCKS ----

  const translateServiceMock = {
    setDefaultLang: jasmine.createSpy('setDefaultLang'),
    use: jasmine.createSpy('use').and.returnValue(of('')),
    get: jasmine.createSpy('get').and.returnValue(of('translated')),
    instant: (key: string) => key
  };

  const authServiceMock = {
    signedIn$: of(false),
    getUsername: () => 'TestUser',
    getUserRole: () => 'user',
    logout: jasmine.createSpy('logout')
  };

  const taskServiceMock = {
    getTasks: jasmine.createSpy('getTasks').and.returnValue(of([])),
    deleteTask: jasmine.createSpy('deleteTask'),
    updateTaskStatus: jasmine.createSpy('updateTaskStatus').and.returnValue(of({}))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const inactivityServiceMock = {};
  const userServiceMock = {};

  // ---- TEST SETUP ----

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslatePipe   // standalone pipe imported here
      ],
      declarations: [
        TaskListComponent
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: InactivityService, useValue: inactivityServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    // ⭐ CRITICAL: override provider for standalone pipe DI
    TestBed.overrideProvider(TranslateService, { useValue: translateServiceMock });

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // runs ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ---- deleteTask TESTS ----

  describe('deleteTask', () => {

    it('should NOT call deleteTask if user cancels confirm dialog', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteTask('123');

      expect(taskServiceMock.deleteTask).not.toHaveBeenCalled();
    });

    it('should call deleteTask when user confirms', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      taskServiceMock.deleteTask.and.returnValue(of({}));

      component.deleteTask('123');

      expect(taskServiceMock.deleteTask).toHaveBeenCalledOnceWith('123');
    });

    it('should remove the task from the list after successful delete', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      taskServiceMock.deleteTask.and.returnValue(of({}));

      component.tasks = [
        { _id: '123', userId: '123', completed: false, priority: 'low', description: 'Task 1', deadline: new Date() },
        { _id: '456', userId: '123', completed: false, priority: 'low', description: 'Task 2', deadline: new Date() }
      ];

      component.deleteTask('123');

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0]._id).toBe('456');
    });

    it('should handle errors when deleteTask fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(console, 'error');
      taskServiceMock.deleteTask.and.returnValue(
        throwError(() => new Error('fail'))
      );

      component.deleteTask('123');

      expect(console.error).toHaveBeenCalled();
    });

  });
});
