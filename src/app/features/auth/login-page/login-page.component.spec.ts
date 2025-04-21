import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

import { AuthService } from '@core/services/auth.service';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        BrowserAnimationsModule,
        LoginPageComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    const usernameControl = component.form.get('username');
    const passwordControl = component.form.get('password');

    expect(usernameControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    expect(usernameControl?.hasValidator(Validators.required)).toBeTrue();
    expect(passwordControl?.hasValidator(Validators.required)).toBeTrue();
    expect(usernameControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();

    component.form.setValue({ username: 'user123', password: 'pass123' });
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should call login and navigate on successful submission', fakeAsync(() => {
    authService.login.and.returnValue(
      of({
        token: 'mock-token',
        user: { id: 1, username: 'user123', role: 'admin' },
      })
    );
    spyOn(router, 'navigate');
    component.form.setValue({ username: 'user123', password: 'pass123' });

    component.submit();
    tick();

    expect(authService.login).toHaveBeenCalledWith('user123', 'pass123');
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(component.error()).toBe('');
  }));

  it('should set error signal on login failure', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: { message: 'Invalid credentials' },
    });
    authService.login.and.returnValue(throwError(() => errorResponse));
    component.form.setValue({ username: 'user123', password: 'wrongpass' });

    component.submit();
    tick();

    expect(authService.login).toHaveBeenCalledWith('user123', 'wrongpass');
    expect(component.error()).toBe('Invalid credentials');
  }));

  it('should display error message in template', fakeAsync(() => {
    const errorResponse = new HttpErrorResponse({
      status: 401,
      error: { message: 'Invalid credentials' },
    });
    authService.login.and.returnValue(throwError(() => errorResponse));
    component.form.setValue({ username: 'user123', password: 'wrongpass' });

    component.submit();
    tick();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('p');
    expect(errorElement.textContent).toBe('Invalid credentials');
  }));

  it('should display form validation errors', () => {
    component.form.get('username')?.setValue('');
    component.form.get('password')?.setValue('');
    component.form.get('username')?.markAsTouched();
    component.form.get('password')?.markAsTouched();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('mat-error');
    expect(errors[0].textContent).toContain('Username is required');
    expect(errors[1].textContent).toContain('Password is required');
  });
});
