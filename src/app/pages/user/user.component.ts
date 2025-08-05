import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbPagination, NgbPaginationPages} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '@app/services/toast.service';
import {AuthStore} from '@app/store/auth.store';
import {UserService} from '@app/services/user.service';
import {ParamsRequest} from '@app/interfaces/params-request';
import {User} from '@app/interfaces/models/user';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthErrorResponse} from '@app/interfaces/responses/auth-error-response';
import {FormsModule} from '@angular/forms';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {UserModalComponent} from '@app/components/user-modal/user-modal.component';
import {DataResponse} from '@app/interfaces/responses/data-response';
import {DatePipe, NgClass} from '@angular/common';
import {CertificationModalComponent} from '@app/components/certification-modal/certification-modal.component';
import {DateUtils} from '@app/utils/date-utils';
import {StaffRenewModalComponent} from '@app/components/staff-renew-modal/staff-renew-modal.component';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

@Component({
  selector: 'app-user',
  imports: [
    FormsModule,
    NgbPagination,
    NgbPaginationPages,
    DatePipe,
    NgClass
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  animations: [loadedAnimation]
})
export class UserComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private authStore = inject(AuthStore);

  protected data: User[] = [];

  protected loading = false;

  protected sortColumn: string = 'name';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  protected totalItems = 0;

  protected params: ParamsRequest = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    order: `${this.sortColumn}:${this.sortDirection}`,
    search: ''
  };

  protected columns = [
    {value: 'name', name: 'Name', class: ''},
    {value: 'position', name: 'Position', class: ''},
    {value: 'email', name: 'Email', class: ''},
    {value: 'phone_number', name: 'Phone Number', class: 'text-center'},
    {value: 'npi', name: 'NPI', class: 'text-center'},
    {value: 'driver_license', name: 'Driver License', class: 'text-center'},
    {value: 'professional_license', name: 'Prof. License', class: 'text-center'},
    {value: 'professional_license2', name: '2nd Prof. License', class: 'text-center'},
    {value: 'ahca', name: 'AHCA', class: 'text-center'},
    // {value: 'fars', name: 'FARS', class: 'text-center'},
    // {value: 'cfars', name: 'CFARS', class: 'text-center'},
    // {value: 'cpr', name: 'CPR', class: 'text-center'},
    // {value: 'first_aid', name: 'First AID', class: 'text-center'},
    // {value: 'hipaa', name: 'HIPAA', class: 'text-center'},
    // {value: 'osha', name: 'OSHA', class: 'text-center'},
    // {value: 'hiv_aids', name: 'HIV/AIDS', class: 'text-center'},
    // {value: 'domestic_violence', name: 'Domestic Violence', class: 'text-center'},
    // {value: 'medical_error', name: 'Medical Error', class: 'text-center'},
    // {value: 'infection_control', name: 'Infection Control', class: 'text-center'},
    // {value: 'patient_rights', name: 'Patient Rights', class: 'text-center'},
    {value: 'status', name: 'Status', class: 'text-center'},
  ];

  private readonly isLoggedIn: boolean;

  constructor() {
    this.isLoggedIn = this.authStore.isLoggedIn();
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.route.queryParams.subscribe(params => {
        this.params.page = +params['page'] || DEFAULT_PAGE;

        if (params['limit']) {
          this.params.limit = +params['limit'] || DEFAULT_LIMIT;
          localStorage.setItem('limit', this.params.limit.toString());
        } else {
          const limit = localStorage.getItem('limit');
          if (limit) {
            this.params.limit = parseInt(limit);
          }
        }

        if (params['order']) {
          const [column, direction] = params['order'].split(':');
          this.sortColumn = column;
          this.sortDirection = direction === 'desc' ? 'desc' : 'asc';
          this.params.order = `${this.sortColumn}:${this.sortDirection}`;
        }

        this.params.search = params['search'] || '';

        this.loadData();
      });
    }
  }

  protected loadData() {
    this.loading = true;
    this.data = [];
    this.totalItems = 0;

    this.userService.users(this.params).subscribe({
      next: (res: DataResponse<User>) => {
        this.data = res.data;
        this.totalItems = res.total;
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

  protected sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.params.order = `${this.sortColumn}:${this.sortDirection}`;

    this.loadData();
    this.updateUrl();
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: 'merge'
    }).then(_r => {

    });
  }

  protected openEditModal(user: User) {
    const modalRef = this.modalService.open(UserModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });

    const instance = modalRef.componentInstance as UserModalComponent;

    instance.setData(user);

    instance.userResponseOk.subscribe((result: string) => {
      this.toastService.success(result);
      this.loadData();
    });

    modalRef.result.catch(() => {

    });
  }

  protected openCreateModal() {
    const modalRef = this.modalService.open(UserModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });

    const instance = modalRef.componentInstance as UserModalComponent;

    instance.userResponseOk.subscribe((result: string) => {
      this.toastService.success(result);
      this.loadData();
    });

    modalRef.result.catch(() => {

    });
  }

  protected delete(id: string) {
    this.userService.delete(id).subscribe({
      next: (_res) => {
        this.toastService.success('User deleted.');

        //this.resetTable();
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status != 401) {
          this.toastService.error(`No se pudo eliminar el link ${err}`);
        }
        console.log(err.error as AuthErrorResponse);
      }
    });
  }

  protected totalPages(): number {
    return Math.ceil(this.totalItems / this.params.limit);
  }

  protected goToPage(page: number | string): void {
    if (typeof page == "string") {
      page = parseInt(page);
    }

    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.params.page = page;
    this.loadData();
    this.updateUrl();
  }

  protected formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  protected resetTable() {
    localStorage.setItem('limit', this.params.limit.toString());

    this.params.page = 1;
    this.updateUrl();
  }

  protected openEditCertificationsModal(user: User) {
    const modalRef = this.modalService.open(CertificationModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg'
    });

    const instance = modalRef.componentInstance as CertificationModalComponent;

    instance.setData(user);

    instance.userResponseOk.subscribe((result: string) => {
      this.toastService.success(result);
      this.loadData();
    });

    modalRef.result.catch(() => {

    });
  }

  protected readonly DateUtils = DateUtils;

  protected openStaffRenewModal() {
    const modalRef = this.modalService.open(StaffRenewModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      //size: 'xl',
      fullscreen: true,
      scrollable: true,
    });

    // const instance = modalRef.componentInstance as StaffRenewModalComponent;

    // instance.setData(user);

    // instance.userResponseOk.subscribe((result: string) => {
    //   this.toastService.success(result);
    //   this.loadData();
    // });

    modalRef.result.catch(() => {

    });
  }

}
