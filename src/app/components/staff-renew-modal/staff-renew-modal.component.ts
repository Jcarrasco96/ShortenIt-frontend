import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {DateUtils} from '@app/utils/date-utils';
import {UserStaff} from '@app/interfaces/models/user-staff';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthErrorResponse} from '@app/interfaces/responses/auth-error-response';
import {UserService} from '@app/services/user.service';
import {ArrayDataResponse} from '@app/interfaces/responses/array-data-response';
import {ToastService} from '@app/services/toast.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-staff-renew-modal',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './staff-renew-modal.component.html',
  styleUrl: './staff-renew-modal.component.css'
})
export class StaffRenewModalComponent implements OnInit {

  protected loading = false;

  protected readonly DateUtils = DateUtils;

  protected columns = [
    {value: 'name', name: 'Name', class: ''},
    // {value: 'position', name: 'Position', class: ''},
    // {value: 'email', name: 'Email', class: ''},
    {value: 'driver_license', name: 'Driver License', class: 'text-center'},
    {value: 'professional_license', name: 'Prof. License', class: 'text-center'},
    {value: 'professional_license2', name: '2nd Prof. License', class: 'text-center'},
    {value: 'ahca', name: 'AHCA', class: 'text-center'},
    {value: 'fars', name: 'FARS', class: 'text-center'},
    {value: 'cfars', name: 'CFARS', class: 'text-center'},
    {value: 'cpr', name: 'CPR', class: 'text-center'},
    {value: 'first_aid', name: 'First AID', class: 'text-center'},
    {value: 'hipaa', name: 'HIPAA', class: 'text-center'},
    {value: 'osha', name: 'OSHA', class: 'text-center'},
    {value: 'hiv_aids', name: 'HIV/AIDS', class: 'text-center'},
    {value: 'domestic_violence', name: 'Domestic Violence', class: 'text-center'},
    {value: 'medical_error', name: 'Medical Error', class: 'text-center'},
    {value: 'infection_control', name: 'Infection Control', class: 'text-center'},
    {value: 'patient_rights', name: 'Patient Rights', class: 'text-center'},
  ];

  protected data: UserStaff[] = [];

  private userService = inject(UserService);
  private toastService = inject(ToastService);

  constructor(private activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.loading = true;
    this.data = [];

    this.userService.staffRenew().subscribe({
      next: (res: ArrayDataResponse<UserStaff>) => {
        this.data = res.data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status != 401) {
          this.toastService.error('Error loading users.');
        }
        console.log(err.error as AuthErrorResponse);
      }
    });
  }

  protected dismiss() {
    this.activeModal.dismiss();
  }

}
