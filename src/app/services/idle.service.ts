import {Injectable, signal} from '@angular/core';
import {fromEvent, merge, Subscription, switchMap, tap, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private timeoutMs = 30 * 60 * 1000;
  private idleSub?: Subscription;

  onTimeout = signal(false);

  startWatching(): void {
    this.stopWatching();

    const events$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'wheel'),
      fromEvent(document, 'touchstart')
    );

    this.idleSub = events$.pipe(
      tap(() => this.onTimeout.set(false)),
      switchMap(() => timer(this.timeoutMs))
    ).subscribe(() => {
      this.onTimeout.set(true);
    });
  }

  stopWatching(): void {
    this.idleSub?.unsubscribe();
    this.onTimeout.set(false);
  }

}
