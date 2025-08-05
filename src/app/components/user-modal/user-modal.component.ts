import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '@app/interfaces/models/user';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '@app/services/user.service';
import {SingleDataResponse} from '@app/interfaces/responses/single-data-response';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-user-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-modal.component.html'
})
export class UserModalComponent {

  private data: User | null = null;
  private isCreating = true;

  protected form: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  protected title: string = 'Create user';

  protected loading = false;

  @Output() userResponseOk = new EventEmitter<string>();

  constructor(private activeModal: NgbActiveModal) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
    });
  }

  protected save() {
    if (!this.form.valid) {
      return;
    }

    const {name, position, email, phone_number} = this.form.value;

    if (this.isCreating) {
      this.loading = true;

      this.userService.create(name, position, email, phone_number).subscribe({
        next: (_res: SingleDataResponse<User>) => {
          this.userResponseOk.emit('User created.');
          this.activeModal.close();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.form.get('name')?.setErrors({
            customError: err?.error?.message || 'Unknown error.'
          });
          this.form.get('name')?.markAsTouched();
          this.loading = false;
        }
      });
    } else {

      if (!this.data) {
        return;
      }

      this.loading = true;

      this.data.name = name;
      this.data.email = email;
      this.data.phone_number = phone_number;
      this.data.position = position;

      this.userService.update(this.data.id, {
        name: this.data.name,
        email: this.data.email,
        phone_number: this.data.phone_number,
        position: this.data.position,
      }).subscribe({
        next: (_res: SingleDataResponse<User>) => {
          this.userResponseOk.emit('User updated.');
          this.activeModal.close();
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.form.get('name')?.setErrors({
            customError: err?.error?.message || 'Unknown error.'
          });
          this.form.get('name')?.markAsTouched();

          this.loading = false;
        }
      });
    }
  }

  protected dismiss() {
    this.activeModal.dismiss();
  }

  public setData(data: User) {
    this.data = data;
    this.form.patchValue({
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      position: data.position,
    });

    this.isCreating = false;
    this.title = 'Update user';
  }

}
