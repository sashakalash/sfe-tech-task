import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UsersListPageComponent } from './users-list-page.component';
import { UsersFacadeService } from '@core/facades/users-facade.service';
import { UsersListComponent } from '@features/users/users-list/users-list.component';
import { User } from '@shared/models/user';

describe('UsersListPageComponent', () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;
  let facade: jasmine.SpyObj<UsersFacadeService>;
  let router: Router;

  const mockUsers: User[] = [
    { id: 1, username: 'user1', role: 'admin' },
    { id: 2, username: 'user2', role: 'user' },
  ];

  beforeEach(() => {
    facade = jasmine.createSpyObj<UsersFacadeService>(
      'UsersFacadeService',
      [
        'loadUsers',
        'saveUser',
        'setUser',
        'clearUser',
        'setSuccessStatus',
        'removeSuccessStatus',
      ],
      {
        users: signal(mockUsers),
        user: signal(null),
        loading: signal(false),
        error: signal(''),
        success: signal(false),
      }
    );

    TestBed.configureTestingModule({
      imports: [MatButtonModule, UsersListPageComponent, UsersListComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    })
      .overrideComponent(UsersListComponent, {
        set: {
          selector: 'app-users-list',
          template: '<div></div>',
          inputs: ['users'],
          outputs: ['edit'],
          providers: [{ provide: UsersFacadeService, useValue: facade }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Users" title', () => {
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toBe('Users');
  });

  it('should show loading message when loading is true', () => {
    component.loading = signal(true);
    fixture.detectChanges();

    const loading = fixture.nativeElement.querySelector('mat-spinner');
    expect(loading).not.toBeNull;
    expect(fixture.nativeElement.querySelector('app-users-list')).toBeNull();
  });

  it('should show users list when loading is false', () => {
    component.loading = signal(false);
    fixture.detectChanges();

    const usersList = fixture.nativeElement.querySelector('app-users-list');
    expect(usersList).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p')).toBeNull();
  });

  it('should navigate to create user page on goToNew', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.goToNew();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/users/create']);
  }));

  it('should navigate to edit user page on goToEdit', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.goToEdit(1);
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/users', 1]);
  }));

  it('should trigger navigation on Add User button click', fakeAsync(() => {
    spyOn(router, 'navigate');
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/users/create']);
  }));
});
