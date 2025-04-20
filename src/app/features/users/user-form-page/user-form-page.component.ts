import { Component, effect, inject } from '@angular/core';
import { User } from '@shared/models/user';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UsersFacadeService } from '@core/facades/users-facade.service';
import { UserFormComponent } from '@features/users/user-form/user-form.component';
import { SNACK_BAR_DEFAULT_OPTIONS } from '@shared/configs/mat-snack-bar.config';
import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-user-form-page',
  imports: [UserFormComponent, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss',
  providers: [UsersFacadeService, UsersService],
})
export class UserFormPageComponent {
  private router = inject(Router);
  private facade = inject(UsersFacadeService);
  private snackBar = inject(MatSnackBar);

  user = this.facade.user;
  loading = this.facade.loading;
  success = this.facade.success;

  constructor() {
    effect(() => {
      if (this.facade.error()) {
        this.snackBar.open(
          `Error: ${this.facade.error()}`,
          'Ok',
          SNACK_BAR_DEFAULT_OPTIONS
        );
      }
    });

    effect(() => {
      if (this.success()) {
        this.facade.removeSuccessStatus();
        this.goBack();
      }
    });
  }

  handleSave(user: Partial<User>): void {
    this.facade.saveUser(user);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
