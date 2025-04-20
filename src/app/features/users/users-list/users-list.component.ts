import { Component, input, output, OutputEmitterRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { User } from '@shared/models/user';

@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  users = input<User[]>([]);
  displayedColumns: string[] = ['username', 'role', 'actions'];

  edit: OutputEmitterRef<number> = output();

  editUser(e: Event, id: number): void {
    e.stopPropagation();
    this.edit.emit(id);
  }
}
