import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { UsersFacadeService } from '@core/facades/users-facade.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let facade: jasmine.SpyObj<UsersFacadeService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let routerEventsSubject: Subject<NavigationEnd>;
  let _router: Router;

  beforeEach(async () => {
    routerEventsSubject = new Subject<NavigationEnd>();
    const routerSpy = {
      events: routerEventsSubject.asObservable(),
    };

    facade = jasmine.createSpyObj<UsersFacadeService>(
      'UsersFacadeService',
      [],
      {
        error: signal(''),
      }
    );
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule, AppComponent],
      providers: [
        { provide: UsersFacadeService, useValue: facade },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    _router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toBe('SFE Tech Task');
  });

  it('should render router-outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
