import {
  Component,
  effect,
  inject,
  input,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { User } from '@shared/models/user';
import { userNameValidator } from '@app/core/validators/user-name.validator';
import { UsersFacadeService } from '@app/core/facades/users-facade.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [UsersFacadeService],
})
export class UserFormComponent {
  user = input<User | null>();

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();

  private fb = inject(FormBuilder);
  private facade = inject(UsersFacadeService);

  form: FormGroup;
  loading = this.facade.loading;

  constructor() {
    this.form = this.fb.group({
      username: ['', [Validators.required, userNameValidator()]],
      role: ['', Validators.required],
      password: [''],
    });
    effect(() => {
      if (this.user()) {
        this.form.patchValue({ ...this.user() });
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const userData = { ...this.user(), ...this.form.value };
      this.save.emit(userData as Partial<User>);
    }
  }
}
