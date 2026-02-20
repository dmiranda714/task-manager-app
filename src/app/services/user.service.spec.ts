import { TestBed } from '@angular/core/testing'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; 
import { UserService } from './user.service'; 
import { User } from '../models/user.model'; 
import { Router } from '@angular/router'; 
import { APP_CONFIG } from '../config/app.config';

fdescribe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], providers: [ UserService ]
    });
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify();});
    
  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should send post request to register a user', () => {
    const mockUser: User = {
      username : 'test',
      password: '123',
      role: 'viewer'
    };

    userService.addUser(mockUser).subscribe();

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl + 'register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    req.flush(null);
  });

  it('should login a user', () => {
    const mockUser = {
      username: 'test',
      password: '123'
    };

    userService.login(mockUser.username, mockUser.password).subscribe();

    const req = httpMock.expectOne(APP_CONFIG.api.baseUrl + 'login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.username).toBe(mockUser.username);
    expect(req.request.body.password).toBe(mockUser.password);

    req.flush({ token: 'abc123' });
  });

  it('should save a userId to local stoage', () => {
    spyOn(localStorage, 'setItem');

    userService.saveUserId('123');

    expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
  });

  it('should save a user role to local stoage', () => {
    spyOn(localStorage, 'setItem');

    userService.saveUserRole('viewer');

    expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'viewer');
  });
});
