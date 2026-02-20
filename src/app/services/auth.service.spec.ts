import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { InactivityService } from './inactivity.service';
import { jwtDecode } from 'jwt-decode';

fdescribe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()], providers: [ AuthService, InactivityService ]
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { httpMock.verify();});

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should call local storage to get token', () => {
    spyOn(localStorage, 'getItem');

    authService.getToken();

    expect(localStorage.getItem).toHaveBeenCalledOnceWith('token');
  });

  it('should call local storage to get google token', () => {
    spyOn(localStorage, 'getItem');

    authService.getGoogleToken();

    expect(localStorage.getItem).toHaveBeenCalledOnceWith('google_access_token');
  });

  it('should return username when decoded token contains a user name', () => {
    const mockDecoded = {username: 'dmiranda'};
    spyOn(authService as any, 'getDecodedToken').and.returnValue(mockDecoded);

    const result = authService.getUsername();

    expect(result).toBe('dmiranda');
  });

  it('should return null when decoded token does not contain a username', () => {
    spyOn(authService as any, 'getDecodedToken').and.returnValue(null);

    const result = authService.getUsername();

    expect(result).toBe(null);
  });

  it('should return a user role when decodedToken contains user role', () => {
    const mockDecoded = {role: 'admin'};

    spyOn(authService as any, 'getDecodedToken').and.returnValue(mockDecoded);

    const result = authService.getUserRole();

    expect(result).toBe('admin');
  });

  it('should return null when decodedToken does not contain a role', () => {
    spyOn(authService as any, 'getDecodedToken').and.returnValue(null);

    const result = authService.getUserRole();

    expect(result).toBe(null);
  });

  it('should return true when a user is logged in and a token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');

    const result = authService.isLoggedIn();

    expect(result).toBeTrue();
  });

  it('should return false when a user is not logged in and no token exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = authService.isLoggedIn();

    expect(result).toBeFalse();
  });

  it('should return null for decoded Token when no token exists', () => {
    spyOn(authService as any, 'getToken').and.returnValue(null);

    const result = authService.getDecodedToken();

    expect(result).toBe(null);
  });

  it('should update isSignedInGoogle with the provided value', () => {
  let emittedValue: boolean | undefined;

  authService.isSignedInGoogle.subscribe(value => {
    emittedValue = value;
  });

  authService.setSignedIn(true);

  expect(emittedValue).toBe(true);
});


});
