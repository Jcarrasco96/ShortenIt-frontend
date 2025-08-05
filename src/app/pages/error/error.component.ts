import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {environment} from '@environments/environment';
import {NgOptimizedImage} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-error',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
  animations: [loadedAnimation]
})
export class ErrorComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected errorCode: number = 500;
  protected errorMessage: string = 'ServerError';

  protected imgHeight: number = 0;
  protected imgWidth: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.errorCode = +params['code'];

      switch (this.errorCode) {
        case 404:
          this.errorMessage = 'NotFound';
          this.imgHeight = 341;
          this.imgWidth = 423;
          break;

        case 403:
          this.errorMessage = 'AccessDenied';
          this.imgHeight = 269;
          this.imgWidth = 227;
          break;

        case 500:
          this.errorMessage = 'ServerError';
          this.imgHeight = 193;
          this.imgWidth = 422;
          break;

        default:
          this.router.navigate(['/home']).then(r => {

          });
      }
    });
  }

}
