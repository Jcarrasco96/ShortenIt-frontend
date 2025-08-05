import {Component, inject, OnInit} from '@angular/core';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {ClientService} from '@app/services/client.service';
import {AuthStore} from '@app/store/auth.store';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthErrorResponse} from '@app/interfaces/responses/auth-error-response';
import {ToastService} from '@app/services/toast.service';
import {FormsModule} from '@angular/forms';
import {NgbPagination, NgbPaginationPages} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '@app/interfaces/models/client';
import {TableColumn} from '@app/interfaces/table-column';
import {DataResponse} from '@app/interfaces/responses/data-response';
import {ClientSearchFilters} from '@app/interfaces/client-search-filters';
import {ClientParamsRequest} from '@app/interfaces/client-params-request';

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

  protected params: ClientParamsRequest = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    order: `${this.sortColumn}:${this.sortDirection}`,
    filters: {
      first_name: null,
      middle_name: null,
      last_name: null,
      dob: null,
      gender: null,
      identification_type: null,
      identification_presented: null,
      incident_report_number: null,
      incident_date: null,
      case_status: null,
    }
  };

  protected columns: TableColumn[] = [
    {value: 'first_name', name: 'First Name', class: ''},
    {value: 'middle_name', name: 'Middle Name', class: ''},
    {value: 'last_name', name: 'Last Name', class: ''},
    {value: 'dob', name: 'Date of birth', class: ''},
    {value: 'gender', name: 'Gender', class: ''},
    {value: 'identification_type', name: 'Ident. Type', class: ''},
    {value: 'identification_presented', name: 'Ident. Presented', class: ''},
    {value: 'incident_report_number', name: 'Incident Report', class: ''},
    {value: 'incident_date', name: 'Incident Date', class: ''},
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

        this.params.filters = this.parseSearchParam(params['search'] || '');

        this.load();
      });
    }
  }

  protected load() {
    this.loading = true;
    this.clients = [];
    this.totalItems = 0;

    this.clientService.clients(this.params).subscribe({
      next: (res: DataResponse<Client>) => {
        console.log(res.data);
        this.clients = res.data;
        this.totalItems = res.total;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status != 401) {
          this.toastService.error('Error loading clients.');
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
    const searchParts = Object.entries(this.params.filters)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join(',');

    const queryParams: any = {
      page: this.params.page,
      limit: this.params.limit,
      order: this.params.order
    };

    if (searchParts.length > 0) {
      queryParams.search = searchParts;
    } else {
      queryParams.search = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
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

  private parseSearchParam(search: string): ClientSearchFilters {
    const filters: ClientSearchFilters = {
      first_name: null,
      middle_name: null,
      last_name: null,
      dob: null,
      gender: null,
      identification_type: null,
      identification_presented: null,
      incident_report_number: null,
      incident_date: null,
      case_status: null,
    };

    if (search) {
      search.split(',').forEach(pair => {
        const [key, value] = pair.split(':');
        if (key in filters) {
          filters[key as keyof ClientSearchFilters] = decodeURIComponent(value);
        }
      });
    }

    return filters;
  }

  clearFilters(): void {
    Object.keys(this.params.filters).forEach(key => {
      this.params.filters[key as keyof ClientSearchFilters] = null;
    });
    this.resetTable();
  }

}
