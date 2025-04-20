import { inject, Injectable } from '@angular/core';

import { UserStore } from '@core/stores/users.store';
import { UsersService } from '@core/services/users.service';
import { User } from '@shared/models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UsersFacadeService {
  private store = inject(UserStore);
  private api = inject(UsersService);

  users = this.store.users.asReadonly();
  user = this.store.user.asReadonly();
  loading = this.store.loading.asReadonly();
  error = this.store.error.asReadonly();
  success = this.store.success.asReadonly();

  loadUsers(): void {
    this.store.setLoading(true);
    this.api.getUsers().subscribe({
      next: (users) => {
        this.store.setUsers(users);
        this.store.setError('');
        this.store.setLoading(false);
      },
      error: (_err) => {
        this.store.setError('Failed to load users');
        this.store.setLoading(false);
      },
    });
  }

  saveUser(user: Partial<User>): void {
    const action = user.id ? this.api.editUser(user) : this.api.addUser(user);
    this.store.setLoading(true);

    action.subscribe({
      next: (saved) => {
        this.store.upsertUser(saved);
        this.store.setLoading(false);
        this.store.setSuccess(true);
      },
      error: (err: HttpErrorResponse) => {
        this.store.setError(`Failed to save user: ${err?.error?.message}`);
        this.store.setLoading(false);
        this.store.setSuccess(false);
      },
    });
  }

  setUser(id: number): void {
    const user = this.users().find((u) => u.id === id);
    if (user) {
      this.store.setUser(user);
    }
  }

  clearUser(): void {
    this.store.setUser(null);
  }

  setSuccessStatus(value: boolean): void {
    this.store.setSuccess(value);
  }

  removeSuccessStatus(): void {
    this.store.setSuccess(null);
  }
}
