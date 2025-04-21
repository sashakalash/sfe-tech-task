import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UsersListComponent } from './users-list.component';
import { User } from '@shared/models/user';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  const mockUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user1', role: 'user' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show "User list is empty" when no users provided', () => {
    fixture.componentRef.setInput('users', []);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector('p');
    expect(msg?.textContent).toContain('User list is empty');
  });

  it('should render a table with users', () => {
    fixture.componentRef.setInput('users', mockUsers);

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tr.cdk-row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('admin');
    expect(rows[1].textContent).toContain('user1');
  });

  it('should emit edit event when clicking the edit icon', () => {
    fixture.componentRef.setInput('users', mockUsers);

    fixture.detectChanges();

    spyOn(component.edit, 'emit');
    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));

    icons[0].triggerEventHandler('click', new Event('click'));
    expect(component.edit.emit).toHaveBeenCalledWith(1);
  });
});
