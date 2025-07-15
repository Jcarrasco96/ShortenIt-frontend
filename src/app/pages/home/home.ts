import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {ToastrService} from 'ngx-toastr';
import {LinksService} from '@app/services/links.service';
import {EditLinkModal} from '@app/components/edit-link-modal/edit-link-modal';
import {HttpErrorResponse} from '@angular/common/http';
import {Link} from '@app/models/link';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    EditLinkModal
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [loadedAnimation]
})
export class Home implements OnInit {

  links: Link[] = [];
  shortenForm: FormGroup;

  loading = false;
  shortening = false;

  constructor(
    private fb: FormBuilder,
    private linksService: LinksService,
    private toastr: ToastrService
  ) {
    this.shortenForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  onSubmit() {
    if (this.shortenForm.invalid) {
      return;
    }

    this.shortening = true;

    const url = this.shortenForm.value.url;

    this.linksService.shortenUrl(url).subscribe({
      next: (_res) => {
        this.shortenForm.reset();
        this.loadLinks();

        this.toastr.success('URL shorted.');
        this.shortening = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Error shortening link.');
        console.log(err);
        this.shortening = false;
      }
    });
  }

  ngOnInit() {
    this.loadLinks();
  }

  loadLinks() {
    this.loading = true;
    this.links = [];

    this.linksService.getLinks().subscribe({
      next: (res) => {
        this.links = res.links;

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Error loading links.');
        console.log(err);
        this.loading = false;
      }
    });
  }

  visitLink(link: Link) {
    window.open('link/' + link.short_code, '_blank');
    link.access_count = (link.access_count || 0) + 1;
  }

  delete(linkId: string) {
    this.linksService.deleteLink(linkId).subscribe({
      next: (_res) => {
        this.links = this.links.filter(link => link.id !== linkId);
        this.toastr.success('Link eliminado.');
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(`No se pudo eliminar el link ${err}`);
        console.log(err);
      }
    })
  }

  onLinkUpdated(updated: any) {
    const index = this.links.findIndex(l => l.id === updated.id);
    if (index !== -1) {
      this.links[index] = updated;
    }

    // this.linksService.updateLink(updated.id, updated.original_url).subscribe(() => {
    this.toastr.success('Link actualizado');
    // });
  }

}
