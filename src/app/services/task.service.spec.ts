import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../models/task.model';
import { APP_CONFIG } from '../config/app.config';

fdescribe('TaskService', () => {
  let taskService: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], providers: [ TaskService ]
    });
    taskService = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify();});

  it('should be created', () => {
    expect(taskService).toBeTruthy();
  });

  it('should return userId from local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('123');

    const res = taskService.getUserId();

    expect(localStorage.getItem).toHaveBeenCalledWith('userId');
    expect(res).toBe('123');

  });

  it('should return userRole from local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('viewer');

    const res = taskService.getUserRole();

    expect(localStorage.getItem).toHaveBeenCalledWith('userRole');
    expect(res).toBe('viewer');
  });

  it('should send a POST to add a task', () => {
    const mockTask: Task = {
    _id: '12345',  
    userId: '123',
    description: 'Jasmine Test',
    deadline: new Date(),
    completed: false,
    priority: 'low'
    }

    taskService.addTask(mockTask).subscribe();

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl + 'AddTask');
    expect(req.request.body).toEqual(mockTask);
    expect(req.request.method).toBe('POST');

    req.flush({message : "Task Updated Successfully"});
  });

  it('should send a GET call to retrieve tasks', () => {
    const mockTasks: Task[] = [ 
      { _id: '1', userId: '123', description: 'Test Task 1', deadline: new Date(), completed: false, priority: 'low' }, 
      { _id: '2', userId: '123', description: 'Test Task 2', deadline: new Date(), completed: true, priority: 'high' } 
    ];

    taskService.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl + 'GetTasks');
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);

  });

  it('should send a PUT call to update task status', () => {
    const mockTask: Task = {
      _id: '1', userId: '123', description: 'Test Task 1', deadline: new Date(), completed: false, priority: 'low'
    }

    const mockRes = {message: 'Task Updated Successfully'};

    taskService.updateTaskStatus(mockTask).subscribe(response => {
      expect(response).toEqual(mockRes);
    });

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl +`UpdateTask/${mockTask._id}`);
    expect(req.request.method).toBe('PUT');

    req.flush(mockRes);
  });

  it('Should send a PUT call to update a task by _id', () => {
    const mockTask: Task = {
      _id: '1', userId: '123', description: 'Test Task 1', deadline: new Date(), completed: false, priority: 'low'
    }

    const mockRes = {message: 'Task Updated Successfully'};

    taskService.updateTask(mockTask._id, mockTask).subscribe(response => {
      expect(response).toEqual(mockRes);
    });

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl+ `UpdateTask/${mockTask._id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTask);

    req.flush(mockRes);


  });

  it('should send a DELETE call to delete by _id', () => {
    const mockTask: Task = {
      _id: '1', userId: '123', description: 'Test Task 1', deadline: new Date(), completed: false, priority: 'low'
    };

    const mockRes = {message : 'Task Deleted Successfully'};

    taskService.deleteTask(mockTask._id).subscribe();

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl+`DeleteTask/${mockTask._id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockRes);
  });

  it('should send a GET Task by _id', () => {
    const mockTask: Task = {
      _id: '1', userId: '123', description: 'Test Task 1', deadline: new Date(), completed: false, priority: 'low'
    };

    taskService.getTaskById(mockTask._id).subscribe(tasks => {
      expect(tasks).toEqual(mockTask);
    });

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl + `GetTask/${mockTask._id}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTask);

  });


});
