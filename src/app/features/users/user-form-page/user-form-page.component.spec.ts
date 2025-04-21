import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UserFormPageComponent } from './user-form-page.component';
import { UsersFacadeService } from '@core/facades/users-facade.service';
import { User } from '@shared/models/user';
import { UsersService } from '@app/core/services/users.service';

describe('UserFormPageComponent', () => {
  let component: UserFormPageComponent;
  let facade: jasmine.SpyObj<UsersFacadeService>;
  let router: Router;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let fixture: ComponentFixture<UserFormPageComponent>;

  const mockUser: User = { id: 1, username: 'test', role: 'user' };
  const mockUserSignal = signal(mockUser);
  const mockLoadingSignal = signal(false);
  const mockSuccessSignal = signal(false);
  const mockErrorSignal = signal('');

  beforeEach(() => {
    facade = jasmine.createSpyObj<UsersFacadeService>(
      'UsersFacadeService',
      ['saveUser', 'removeSuccessStatus'],
      {
        user: mockUserSignal,
        loading: mockLoadingSignal,
        success: mockSuccessSignal,
        error: mockErrorSignal,
      }
    );
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [UserFormPageComponent],
      providers: [
        UsersService,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });

    TestBed.overrideComponent(UserFormPageComponent, {
      set: {
        providers: [
          { provide: UsersFacadeService, useValue: facade },
          { provide: MatSnackBar, useValue: snackBar },
        ],
      },
    });

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveUser on handleSave', () => {
    const user: Partial<User> = { username: 'user123' };

    component.handleSave(user);

    expect(facade.saveUser).toHaveBeenCalledWith(user);
  });

  it('should show snackbar on error signal', () => {
    TestBed.runInInjectionContext(() => {
      mockErrorSignal.set('Test error');
    });

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error: Test error',
      'Ok',
      jasmine.any(Object)
    );
  });

  it('should navigate on success signal', () => {
    TestBed.runInInjectionContext(() => {
      mockSuccessSignal.set(true);
    });

    fixture.detectChanges();

    expect(facade.removeSuccessStatus).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate back on goBack', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });
});
