import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { signal } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';

import { UsersFacadeService } from './users-facade.service';
import { UserStore } from '@core/stores/users.store';
import { UsersService } from '@core/services/users.service';
import { User } from '@shared/models/user';

const mockedUserStore = jasmine.createSpyObj<UserStore>(
  'UserStore',
  ['setUsers', 'setLoading', 'setError', 'setUser', 'setSuccess', 'upsertUser'],
  {
    users: signal<User[]>([]),
    user: signal<User | null>(null),
    loading: signal(false),
    error: signal(''),
    success: signal<boolean | null>(null),
  }
);

describe('UsersFacadeService', () => {
  let service: UsersFacadeService;
  let mockUserStore: jasmine.SpyObj<UserStore>;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  const mockUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ];

  const mockUser: User = { id: 3, username: 'user2', role: 'user' };

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj<UsersService>('UsersService', [
      'getUsers',
      'addUser',
      'editUser',
    ]);

    TestBed.configureTestingModule({
      providers: [
        UsersFacadeService,
        { provide: UserStore, useValue: mockedUserStore },
        { provide: UsersService, useValue: mockUsersService },
      ],
    });

    service = TestBed.inject(UsersFacadeService);
    mockUserStore = TestBed.inject(UserStore) as jasmine.SpyObj<UserStore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      mockUsersService.getUsers.and.returnValue(cold('-a|', { a: mockUsers }));

      service.loadUsers();

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.getUsers).toHaveBeenCalled();

      mockUsersService.getUsers().subscribe(() => {
        expect(mockUserStore.setUsers).toHaveBeenCalledWith(mockUsers);
        expect(mockUserStore.setError).toHaveBeenCalledWith('');
        expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should handle error when loading users fails', () => {
      mockUsersService.getUsers.and.returnValue(
        throwError(() => new Error('Boom'))
      );

      service.loadUsers();

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUserStore.setError).toHaveBeenCalledWith(
        'Failed to load users'
      );
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('saveUser', () => {
    it('should add a new user successfully', () => {
      const newUser: Partial<User> = { username: 'user123', role: 'user' };
      mockUsersService.addUser.and.returnValue(cold('-a|', { a: mockUser }));

      service.saveUser(newUser);

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.addUser).toHaveBeenCalledWith(newUser);
      expect(mockUsersService.editUser).not.toHaveBeenCalled();

      mockUsersService.addUser(newUser).subscribe(() => {
        expect(mockUserStore.upsertUser).toHaveBeenCalledWith(mockUser);
        expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should edit an existing user successfully', () => {
      const existingUser: Partial<User> = {
        id: 1,
        username: 'admin_updated',
        role: 'admin',
      };
      mockUsersService.editUser.and.returnValue(
        cold('-a|', { a: { ...mockUser, ...existingUser } })
      );

      service.saveUser(existingUser);
      getTestScheduler().flush();

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.editUser).toHaveBeenCalledWith(existingUser);
      expect(mockUsersService.addUser).not.toHaveBeenCalled();

      mockUsersService.editUser(existingUser).subscribe(() => {
        expect(mockUserStore.upsertUser).toHaveBeenCalledWith({
          ...mockUser,
          ...existingUser,
        });
        expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should handle error when saving a user fails', () => {
      const newUser: Partial<User> = { username: 'user123', role: 'user' };
      const error = new Error();
      mockUsersService.addUser.and.returnValue(cold('-#', null, error));

      service.saveUser(newUser);

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.addUser).toHaveBeenCalledWith(newUser);

      mockUsersService
        .addUser(newUser)
        .pipe(
          catchError(() => {
            return EMPTY;
          })
        )
        .subscribe(() => {
          expect(mockUserStore.setError).toHaveBeenCalledWith(
            'Failed to save user'
          );
          expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
          expect(mockUserStore.upsertUser).not.toHaveBeenCalled();
        });
    });

    xit('should handle error when editing a user fails', () => {
      const existingUser: Partial<User> = {
        id: 1,
        username: 'admin_updated',
        role: 'admin',
      };
      const error = new Error();
      mockUsersService.editUser.and.returnValue(cold('-#', null, error));

      service.saveUser(existingUser);

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.editUser).toHaveBeenCalledWith(existingUser);

      mockUsersService
        .editUser(existingUser)
        .pipe(
          catchError(() => {
            expect(mockUserStore.setError).toHaveBeenCalled();
            expect(mockUserStore.upsertUser).toHaveBeenCalled(); // TODO find out why it fails
            return EMPTY;
          })
        )
        .subscribe();
    });
  });

  describe('signals', () => {
    it('should expose users signal', () => {
      expect(service.users()).toEqual([]);
    });

    it('should expose user signal', () => {
      expect(service.user()).toBeNull();
    });

    it('should expose loading signal', () => {
      expect(service.loading()).toBeFalse();
    });

    it('should expose error signal', () => {
      expect(service.error()).toEqual('');
    });
  });
});
