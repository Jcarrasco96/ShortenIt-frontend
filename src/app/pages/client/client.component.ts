import {Component, inject, OnInit} from '@angular/core';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {ClientService} from '@app/services/client.service';
import {ParamsRequest} from '@app/interfaces/params-request';
import {ClientsResponse} from '@app/interfaces/clients-response';
import {AuthStore} from '@app/store/auth.store';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthErrorResponse} from '@app/interfaces/auth-error-response';
import {ToastService} from '@app/services/toast.service';
import {FormsModule} from '@angular/forms';
import {NgbPagination, NgbPaginationPages} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '@app/interfaces/client';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

@Component({
  selector: 'app-client',
  imports: [
    FormsModule,
    NgbPagination,
    NgbPaginationPages
  ],
  templateUrl: './client.component.html',
  animations: [loadedAnimation]
})
export class ClientComponent implements OnInit {

  private clientService = inject(ClientService);
  private authStore = inject(AuthStore);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  protected clients: Client[] = [];

  protected loading = false;

  protected sortColumn: string = 'first_name';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  protected totalItems = 0;

  protected params: ParamsRequest = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    order: `${this.sortColumn}:${this.sortDirection}`,
    search: ''
  };

  protected columns = [
    {value: 'first_name', name: 'First Name', class: ''},
    {value: 'middle_name', name: 'Middle Name', class: 'text-center'},
    {value: 'last_name', name: 'Last Name', class: 'text-center'},
    {value: 'dob', name: 'Date of birth', class: 'text-center'},
    {value: 'gender', name: 'Gender', class: 'text-center'},
    {value: 'identification_type', name: 'Identification Type', class: 'text-center'},
    {value: 'identification_presented', name: 'Identification Presented', class: 'text-center'},
    {value: 'incident_report_number', name: 'Incident Report Number', class: 'text-center'},
    {value: 'incident_date', name: 'Incident Date', class: 'text-center'},
    {value: 'case_status', name: 'Case Status', class: 'text-center'},
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

        this.load();
      });
    }
  }

  protected load() {
    this.loading = true;
    this.clients = [];
    this.totalItems = 0;

    this.clientService.clients(this.params).subscribe({
      next: (res: ClientsResponse) => {
        this.clients = res.clients;
        this.totalItems = res.total;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status != 401) {
          this.toastService.error('Error loading links.');
        }
        console.log(err.error as AuthErrorResponse);
      }
    });
  }

  protected totalPages(): number {
    return Math.ceil(this.totalItems / this.params.limit);
  }

  protected resetTable() {
    localStorage.setItem('limit', this.params.limit.toString());

    this.params.page = 1;
    this.updateUrl();
  }

  protected sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.params.order = `${this.sortColumn}:${this.sortDirection}`;

    this.load();
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

  protected goToPage(page: number | string): void {
    if (typeof page == "string") {
      page = parseInt(page);
    }

    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.params.page = page;
    this.load();
    this.updateUrl();
  }

  protected formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }

}
