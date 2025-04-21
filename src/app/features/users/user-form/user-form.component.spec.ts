import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UserFormComponent } from './user-form.component';
import { User } from '@shared/models/user';
import { UsersService } from '@app/core/services/users.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockUser: User = {
    id: 1,
    username: 'user123',
    role: 'admin',
    password: 'pass123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        UserFormComponent,
      ],
      providers: [
        UsersService,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    const usernameControl = component.form.get('username');
    const roleControl = component.form.get('role');
    const passwordControl = component.form.get('password');

    expect(usernameControl).toBeTruthy();
    expect(roleControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    expect(usernameControl?.hasValidator(Validators.required)).toBeTrue();
    expect(roleControl?.hasValidator(Validators.required)).toBeTrue();
    expect(passwordControl?.value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    component.form.setValue({
      username: 'user123',
      role: 'user',
      password: '',
    });
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should emit save event with form data on valid submission', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({
      username: 'user123',
      role: 'user',
      password: 'pass456',
    });

    component.submit();

    expect(component.save.emit).toHaveBeenCalledWith({
      username: 'user123',
      role: 'user',
      password: 'pass456',
    });
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({ username: '', role: '', password: '' });

    component.submit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    const cancelButton = fixture.nativeElement.querySelector(
      'button:not([type="submit"])'
    );

    cancelButton.click();
    fixture.detectChanges();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should populate form with user input when provided', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(component.form.value).toEqual({
      username: 'user123',
      role: 'admin',
      password: 'pass123',
    });
  });

  it('should merge user input with form data on save', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({
      username: 'user123_updated',
      role: 'user',
      password: 'newpass',
    });
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const expectedUser = { ...component.user(), ...component.form.value };
    component.submit();

    expect(component.save.emit).toHaveBeenCalledWith(expectedUser);
  });

  it('should display form validation errors', () => {
    component.form.get('username')?.setValue('');
    component.form.get('role')?.setValue('');
    component.form.get('username')?.markAsTouched();
    component.form.get('role')?.markAsTouched();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('mat-error');
    expect(errors[0].textContent).toContain('Username is required');
    expect(errors[1].textContent).toContain('Role is required');
  });
});
