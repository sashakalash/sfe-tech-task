import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersService } from '@app/core/services/users.service';
import { UsersListComponent } from '@features/users/users-list/users-list.component';
import { UsersFacadeService } from '@core/facades/users-facade.service';

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, MatButton, MatProgressSpinnerModule],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
  providers: [UsersFacadeService, UsersService],
})
export class UsersListPageComponent implements OnInit {
  facade = inject(UsersFacadeService);
  router = inject(Router);
  error = this.facade.error;
  loading = this.facade.loading;
  users = this.facade.users;

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users', id]);
  }
}
