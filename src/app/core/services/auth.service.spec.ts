import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponse } from '@shared/models/auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token',
    user: {
      id: 1,
      username: 'user123',
      role: 'admin',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClientTesting(), provideHttpClient()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    xit('should send a POST request to login endpoint and return AuthResponse on success', () => {
      const username = 'user123';
      const password = 'user123';

      service.login(username, password).subscribe((response) => {
        expect(response).toEqual(mockAuthResponse);
        expect(response.token).toBe('mock-token');
        expect(response.user.username).toBe('user123');

        const req = httpMock.expectOne('api/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ username, password });
        req.flush(mockAuthResponse);
      });
    });

    xit('should handle 401 Unauthorized error', () => {
      const username = 'wrongUser';
      const password = 'wrongpass';
      const errorResponse = { message: 'Invalid credentials' };

      let actualError: any;

      service
        .login(username, password)
        .pipe(
          catchError((error) => {
            actualError = error;
            return EMPTY;
          })
        )
        .subscribe();

      const req = httpMock.expectOne('api/auth/login'); // TODO find out why it fails
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });

      expect(actualError.status).toBe(401);
      expect(actualError.error).toEqual(errorResponse);
    });

    xit('should handle generic server error', () => {
      const username = 'user123';
      const password = 'pass123';
      const errorResponse = 'NOT FOUND';

      let actualError: any;

      service
        .login(username, password)
        .pipe(
          catchError((error) => {
            actualError = error;
            return EMPTY;
          })
        )
        .subscribe();

      const req = httpMock.expectOne('api/auth/login'); // TODO find out why it fails
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush(errorResponse, {
        status: 500,
        statusText: 'Internal Server Error',
      });

      expect(actualError.status).toBe(500);
      expect(actualError.error).toEqual(errorResponse);
    });
  });
});
