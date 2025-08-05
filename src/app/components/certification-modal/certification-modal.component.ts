import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '@app/interfaces/models/user';
import {UserService} from '@app/services/user.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DateUtils} from '@app/utils/date-utils';
import {SingleDataResponse} from '@app/interfaces/responses/single-data-response';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-certification-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './certification-modal.component.html',
})
export class CertificationModalComponent {

  protected _id: string = '';
  protected _name: string = '';

  protected form: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  protected loading = false;

  @Output() userResponseOk = new EventEmitter<string>();

  constructor(private activeModal: NgbActiveModal) {
    this.form = this.fb.group({
      npi: ['', [Validators.pattern(/^\d{10}$/)]],
      driver_license: ['', []],
      professional_license: ['', []],
      professional_license2: ['', []],
      ahca: ['', []],
      fars: ['', [Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],
      cfars: ['', [Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],
      cpr: ['', []],
      first_aid: ['', []],
      hipaa: ['', []],
      osha: ['', []],
      hiv_aids: ['', []],
      domestic_violence: ['', []],
      medical_error: ['', []],
      infection_control: ['', []],
      patient_rights: ['', []],
    });
  }

  protected save() {
    if (!(this.form.valid && this._id)) {
      return;
    }

    this.loading = true;

    const { npi, driver_license, professional_license, professional_license2, ahca, fars, cfars, cpr, first_aid, hipaa, osha, hiv_aids, domestic_violence, medical_error, infection_control, patient_rights } = this.form.value;

    const data = {
      npi: npi,
      driver_license: driver_license,
      professional_license: professional_license,
      professional_license2: professional_license2,
      ahca: ahca,
      fars: fars,
      cfars: cfars,
      cpr: cpr,
      first_aid: first_aid,
      hipaa: hipaa,
      osha: osha,
      hiv_aids: hiv_aids,
      domestic_violence: domestic_violence,
      medical_error: medical_error,
      infection_control: infection_control,
      patient_rights: patient_rights,
    }

    this.userService.updateCertifications(this._id, data).subscribe({
      next: (_res: SingleDataResponse<User>) => {
        this.userResponseOk.emit('Certifications updated.');
        this.activeModal.close();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.form.get('driver_license')?.setErrors({
          customError: err?.error?.message || 'Unknown error.'
        });
        this.form.get('driver_license')?.markAsTouched();

        this.loading = false;
      }
    });
  }

  protected dismiss() {
    this.activeModal.dismiss();
  }

  public setData(data: User) {
    this._id = data.id;
    this._name = data.name;

    this.form.patchValue({
      npi: data.npi,
      driver_license: data.driver_license,
      professional_license: data.professional_license,
      professional_license2: data.professional_license2,
      ahca: data.ahca,
      fars: data.fars,
      cfars: data.cfars,
      cpr: data.cpr,
      first_aid: data.first_aid,
      hipaa: data.hipaa,
      osha: data.osha,
      hiv_aids: data.hiv_aids,
      domestic_violence: data.domestic_violence,
      medical_error: data.medical_error,
      infection_control: data.infection_control,
      patient_rights: data.patient_rights,
    });
  }

  protected value(field: string): string {
    return this.form.get(field)?.value;
  }

  protected infoMessage(param: string) {
    const classColor = DateUtils.dateClassColor(this.value(param));
    const expirationText = DateUtils.expirationText(this.value(param));

    return `<span class="${classColor}">${expirationText}</span>`;
  }

  protected errorMessage(param: string): string | null {
    if (this.form.get(param)?.touched && this.form.get(param)?.errors) {
      if (this.form.get(param)?.errors?.['required']) {
        return 'This field is required.';
      }
      if (this.form.get(param)?.errors?.['pattern']) {
        return 'This field is invalid.';
      }
      if (this.form.get(param)?.errors?.['customError']) {
        return this.form.get(param)?.errors?.['customError'];
      }
    }
    return null;
  }

  protected isValid(param: string): boolean | undefined {
    return this.form.get(param)?.valid && !(this.form.get(param)?.invalid && this.form.get(param)?.touched)
  }

}
