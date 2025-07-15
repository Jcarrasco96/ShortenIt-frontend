import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LinksService} from '@app/services/links.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-link-redirect',
  imports: [],
  templateUrl: './link-redirect.component.html',
  styleUrl: './link-redirect.component.css'
})
export class LinkRedirectComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.linksService.visitLink(code).subscribe({
        next: (res) => {

          if (res.link.original_url) {
            window.location.href = res.link.original_url;
          } else {
            console.error('URL original no encontrada');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error redirigiendo:', err.message);

          this.router.navigate(['/home']).then(_r => {
            console.log('goto HOME from LINK_REDIRECT component');
          });
        }
      });
    }
  }

}
