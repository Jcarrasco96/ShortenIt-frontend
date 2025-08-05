import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LinksService} from '@app/services/links.service';
import {HttpErrorResponse} from '@angular/common/http';
import {loadedAnimation} from '@app/animations/loaded.animation';

@Component({
  standalone: true,
  selector: 'app-link-redirect',
  imports: [],
  templateUrl: './link-redirect.component.html',
  animations: [loadedAnimation]
})
export class LinkRedirectComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private linksService = inject(LinksService);
  private router = inject(Router);

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.linksService.visit(code).subscribe({
        next: (res) => {

          if (res.data.original_url) {
            //window.location.href = res.link.original_url;
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
