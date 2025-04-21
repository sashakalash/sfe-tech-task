import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { cold } from 'jasmine-marbles';

import { AuthService } from '@core/services/auth.service';
import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'getAccessToken',
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header with token when token exists', () => {
    authService.getAccessToken.and.returnValue('test-token');
    const request = new HttpRequest('GET', '/test');
    TestBed.runInInjectionContext(() => {
      tokenInterceptor(request, (req) => {
        expect(req.headers.get('Authorization')).toBe('Bearer test-token');
        return cold('a|', { a: { data: 'test' } });
      }).subscribe();
    });
  });

  it('should redirect to auth when no token exists', () => {
    authService.getAccessToken.and.returnValue(null);
    const request = new HttpRequest('GET', '/test');
    TestBed.runInInjectionContext(() => {
      tokenInterceptor(request, (req) => {
        expect(req.headers.get('Authorization')).toBeNull();
        return cold('a|', { a: { data: 'test' } });
      }).subscribe();
    });
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });
});
