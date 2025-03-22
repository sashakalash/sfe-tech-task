import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = 'api/users';
}
