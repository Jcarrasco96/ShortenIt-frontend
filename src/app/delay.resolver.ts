import {Resolve} from '@angular/router';
import {delay, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DelayResolver implements Resolve<void> {

  resolve(): Observable<void> {
    return of(void 0).pipe(delay(2500));
  }

}
