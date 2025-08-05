import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {LinksService} from '@app/services/links.service';

@Component({
  standalone: true,
  selector: 'app-create-link',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-link.component.html',
})
export class CreateLinkComponent {

  private fb = inject(FormBuilder);
  private linksService = inject(LinksService);

  protected shortenForm: FormGroup;
  protected loading = false;

  @Output() onSubmitted: EventEmitter<void> = new EventEmitter();

  constructor() {
    this.shortenForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  protected onSubmit() {
    if (this.shortenForm.invalid) {
      return;
    }

    this.loading = true;

    const { url } = this.shortenForm.value;

    this.linksService.short(url).subscribe({
      next: (_res) => {
        this.shortenForm.reset();

        this.onSubmitted.emit();

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.shortenForm.get('url')?.setErrors({
          customError: err?.error?.message || 'Unknown error.'
        });
        this.shortenForm.get('url')?.markAsTouched();
        this.loading = false;
      }
    });
  }

}
