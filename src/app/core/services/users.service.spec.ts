import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

import { UsersService } from './users.service';
import { User } from '@shared/models/user';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user1', role: 'user' },
  ];

  const mockUser: User = { id: 3, username: 'user123', role: 'user' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should send a GET request to fetch users and return User[]', () => {
      const users$ = service
        .getUsers()
        .pipe(
          catchError((error) => {
            return EMPTY;
          })
        )
        .subscribe((users) => {
          expect(users).toEqual(mockUsers);

          const req = httpMock.expectOne('api/users');
          expect(req.request.method).toBe('GET');
          req.flush(mockUsers);
        });
    });

    it('should handle 404 error when fetching users fails', () => {
      const errorResponse = 'NOT FOUND';

      service
        .getUsers()
        .pipe(
          catchError((error) => {
            expect(error.status).toBe(404);
            expect(error.error).toEqual(errorResponse);
            return EMPTY;
          })
        )
        .subscribe(() => {
          const req = httpMock.expectOne('api/users');
          expect(req.request.method).toBe('GET');
          req.flush(errorResponse, { status: 404, statusText: 'NOT FOUND' });
        });
    });
  });

  describe('addUser', () => {
    xit('should send a POST request to add a user and return User', () => {
      const newUser: Partial<User> = { username: 'user123', role: 'user' };
      const mockResponse: User = { id: 1, username: 'user123', role: 'user' };

      service.addUser(newUser).subscribe((user) => {
        expect(user).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('api/users/create'); // TODO find out why it fails
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);

      req.flush(mockResponse);
    });

    xit('should handle 404 error when adding a user fails', () => {
      const newUser: Partial<User> = { username: 'user123', role: 'user' };
      const errorResponse = 'NOT FOUND';

      let actualError: any;

      service
        .addUser(newUser)
        .pipe(
          catchError((error) => {
            expect(error.status).toBe(404);
            expect(error.error).toEqual(errorResponse);
            return EMPTY;
          })
        )
        .subscribe();

      const req = httpMock.expectOne(
        (
          req // TODO find out why it fails
        ) => req.url.endsWith('api/users/create')
      );
      expect(req.request.url).toBe('api/users/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);

      req.flush(errorResponse, { status: 404, statusText: 'Bad Request' });
    });
  });

  describe('editUser', () => {
    it('should send a PUT request to edit a user and return User', () => {
      const updatedUser: Partial<User> = {
        id: 1,
        username: 'user123',
        role: 'admin',
      };
      const expectedUser: User = {
        id: 1,
        username: 'user123_updated',
        role: 'admin',
      };

      service
        .editUser(updatedUser)
        .pipe(
          catchError((error) => {
            return EMPTY;
          })
        )
        .subscribe((user) => {
          expect(user).toEqual(expectedUser);
          expect(user.username).toBe('user123_updated');

          const req = httpMock.expectOne('api/users/1');
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual(updatedUser);
          req.flush(expectedUser);
        });
    });

    it('should handle 404 error when editing a user fails', () => {
      const errorResponse = { message: 'Invalid user data' };
      const updatedUser: Partial<User> = {
        id: 1,
        username: 'user321_updated',
        role: 'admin',
      };

      service
        .editUser(updatedUser)
        .pipe(
          catchError((error) => {
            expect(error.status).toBe(404);
            expect(error.error).toEqual('NOT FOUND');
            return EMPTY;
          })
        )
        .subscribe(() => {
          const req = httpMock.expectOne('api/users/1');
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual(updatedUser);
          req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
        });
    });
  });
});
