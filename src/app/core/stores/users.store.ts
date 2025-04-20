import { Injectable, signal } from '@angular/core';
import { User } from '@shared/models/user';

@Injectable({ providedIn: 'root' })
export class UserStore {
  users = signal<User[]>([]);
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal('');
  success = signal<boolean | null>(null);

  setUsers(newUsers: User[]): void {
    this.users.set(newUsers);
  }

  setUser(newUser: User | null): void {
    this.user.set(newUser);
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  setSuccess(value: boolean | null): void {
    this.success.set(value);
  }

  setError(message: string): void {
    if (this.error() === message) {
      this.error.set('');
    }
    this.error.set(message);
  }

  upsertUser(user: User): void {
    const current = this.users();
    const index = current.findIndex((u) => u.id === user.id);
    if (index === -1) {
      this.users.set([...current, user]);
    } else {
      const updated = [...current];
      updated[index] = user;
      this.users.set(updated);
    }
    this.user.set(user);
  }
}
