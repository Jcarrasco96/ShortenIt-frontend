import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LinksService} from '@app/services/links.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Link} from '@app/interfaces/models/link';
import {DataResponse} from '@app/interfaces/responses/data-response';

@Component({
  standalone: true,
  selector: 'app-edit-link-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-link-modal.component.html',
})
export class EditLinkModalComponent {

  private link: Link | null = null;

  protected editForm: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private linksService = inject(LinksService);

  constructor(private activeModal: NgbActiveModal) {
    this.editForm = this.fb.group({
      original_url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      short_code: ['', [Validators.required]],
    });
  }

  protected save() {
    if (!(this.editForm.valid && this.link)) {
      return;
    }

    const {original_url, short_code} = this.editForm.value;

    this.link.original_url = original_url;
    this.link.short_code = short_code;

    this.linksService.update(this.link.id, {
      original_url: this.link.original_url,
      short_code: this.link.short_code,
    }).subscribe({
      next: (_res: DataResponse<Link> | false) => {
        this.activeModal.close('Link updated.');
      },
      error: (err: HttpErrorResponse) => {
        this.editForm.get('original_url')?.setErrors({
          customError: err?.error?.message || 'Unknown error.'
        });
        this.editForm.get('original_url')?.markAsTouched();
      }
    });
  }

  protected dismiss() {
    this.activeModal.dismiss();
  }

  public setLink(link: Link) {
    this.link = link;
    this.editForm.patchValue({
      original_url: link.original_url,
      short_code: link.short_code,
    });
  }

}
