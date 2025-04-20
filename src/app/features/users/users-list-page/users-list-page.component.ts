import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersService } from '@app/core/services/users.service';
import { UsersListComponent } from '@features/users/users-list/users-list.component';
import { UsersFacadeService } from '@core/facades/users-facade.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DEFAULT_OPTIONS } from '@app/shared/configs/mat-snack-bar.config';

@Component({
  selector: 'app-users-list-page',
  imports: [UsersListComponent, MatButton, MatProgressSpinnerModule],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
  providers: [UsersFacadeService, UsersService],
})
export class UsersListPageComponent implements OnInit {
  facade = inject(UsersFacadeService);
  private snackBar = inject(MatSnackBar);

  router = inject(Router);
  error = effect(() => {
    if (this.facade.error()) {
      this.snackBar.open(
        `Error: ${this.facade.error()}`,
        'Ok',
        SNACK_BAR_DEFAULT_OPTIONS
      );
    }
  });
  loading = this.facade.loading;
  users = this.facade.users;

  ngOnInit(): void {
    this.facade.loadUsers();
    this.facade.clearUser();
  }

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.facade.setUser(id);
    this.router.navigate(['/users', id]);
  }
}
