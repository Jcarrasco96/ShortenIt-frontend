import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {LinksService} from '@app/services/links.service';
import {EditLinkModalComponent} from '@app/components/edit-link-modal/edit-link-modal.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbPagination, NgbPaginationPages} from '@ng-bootstrap/ng-bootstrap';
import {ParamsRequest} from '@app/interfaces/params-request';
import {CreateLinkComponent} from '@app/components/create-link/create-link.component';
import {ToastService} from '@app/services/toast.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {AuthErrorResponse} from '@app/interfaces/responses/auth-error-response';
import {AuthStore} from '@app/store/auth.store';
import {Link} from '@app/interfaces/models/link';
import {DataResponse} from '@app/interfaces/responses/data-response';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    FormsModule,
    NgbPagination,
    NgbPaginationPages,
    CreateLinkComponent,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './home.component.html',
  animations: [loadedAnimation]
})
export class HomeComponent implements OnInit {

  private linkService = inject(LinksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private authStore = inject(AuthStore);

  protected links: Link[] = [];

  protected loading = false;

  protected sortColumn: string = 'original_url';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  protected totalItems = 0;

  protected params: ParamsRequest = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    order: `${this.sortColumn}:${this.sortDirection}`,
    search: '',
    // filters: {
    //   original_url: null,
    //   short_code: null,
    //   access_count: null,
    //   created_at: null,
    // }
  };

  protected columns = [
    {value: 'original_url', name: 'Original URL', class: ''},
    {value: 'short_code', name: 'Code', class: 'text-center'},
    {value: 'access_count', name: 'Access Count', class: 'text-center'},
    {value: 'created_at', name: 'Created at', class: 'text-center'},
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

        // this.params.search = params['search'] || '';

        this.loadLinks();
      });
    }
  }

  protected loadLinks() {
    this.loading = true;
    this.links = [];
    this.totalItems = 0;

    this.linkService.links(this.params).subscribe({
      next: (res: DataResponse<Link>) => {
        this.links = res.data;
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

  protected visitLink(link: Link) {
    window.open('link/' + link.short_code, '_blank');
    link.access_count = (link.access_count || 0) + 1;
  }

  protected delete(linkId: string) {
    this.linkService.delete(linkId).subscribe({
      next: (_res) => { // todo change this
        // this.links = this.links.filter(link => link.id !== linkId);
        this.loadLinks();
        this.toastService.success('Link eliminado.');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status != 401) {
          this.toastService.error(`No se pudo eliminar el link ${err}`);
        }
        console.log(err.error as AuthErrorResponse);
      }
    })
  }

  protected sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.params.order = `${this.sortColumn}:${this.sortDirection}`;

    this.loadLinks();
    this.updateUrl();
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
    this.loadLinks();
    this.updateUrl();
  }

  protected formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: 'merge'
    }).then(_r => {

    });
  }

  protected resetTable() {
    localStorage.setItem('limit', this.params.limit.toString());

    this.params.page = 1;
    this.updateUrl();
  }

  protected openEditModal(link: Link) {
    const modalRef = this.modalService.open(EditLinkModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });

    (modalRef.componentInstance as EditLinkModalComponent).setLink(link);

    modalRef.result.then((result: string) => {
      this.toastService.success(result);
    }, (_reason) => {

    });
  }

  protected onSubmitted() {
    this.loadLinks();
    this.resetTable();

    this.toastService.success('URL shorted.');
  }

}
