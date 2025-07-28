import {Component, effect, inject, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import {NavbarLayout} from '@app/layouts/navbar/navbar.layout';
import {NgProgressbar} from 'ngx-progressbar';
import {NgProgressHttp} from 'ngx-progressbar/http';
import {NgProgressRouter} from 'ngx-progressbar/router';
import {FooterComponent} from '@app/layouts/footer/footer.component';
import {ToastComponent} from '@app/components/toast/toast.component';
import {AuthStore} from '@app/store/auth.store';
import {ErrorStore} from '@app/store/error.store';
import {IdleService} from '@app/services/idle.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarLayout,
    NgProgressbar,
    NgProgressHttp,
    NgProgressRouter,
    FooterComponent,
    ToastComponent,
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {

  private router = inject(Router);

  private authStore = inject(AuthStore);
  private errorStore = inject(ErrorStore);

  private idleService = inject(IdleService);

  protected isLoggedIn = false;
  protected appInitialized = false;
  protected showLayout = true;

  constructor() {
    this.idleService.startWatching();

    effect(() => {
      if (this.idleService.onTimeout()) {
        console.log('Sesión expirada por inactividad');

        this.authStore.logout();

        this.router.navigate(['/login']).then(_r => {

        });
      }
    });

    effect(() => {
      this.isLoggedIn = this.authStore.isLoggedIn();
    });

    effect(() => {
      const error = this.errorStore.error();

      if (error) {
        console.log('Change errors:', error);

        this.errorStore.clearError();

        if (error.status == 401) {
          this.authStore.logout();

          this.router.navigate(['/login']).then(_r => {
            console.log('goto LOGIN from APP');
          });
        } else {
          this.router.navigate([`/error/${error.status}`]).then(_r => {
            console.log('goto ERROR from APP');
          });
        }
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.appInitialized = false;

        const isLoggedIn = this.authStore.isLoggedIn();

        if (event.url.includes('/login') && isLoggedIn) {
          this.router.navigate(['/home']).then(_r => {
            console.log('goto HOME from APP -> /login');
          });
        }
      }

      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
        document.title = title + ' | ShortenIt';

        const route = this.getDeepestRoute(this.router.routerState.root);

        this.showLayout = route.snapshot.data['public'] !== true;
        this.appInitialized = true;
      }
    });
  }

  private getTitle(state: any, parent: any): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

}
