import {Injectable, signal} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class ErrorStore {

  private _error = signal<HttpErrorResponse | null>(null);
  readonly error = this._error.asReadonly();

  setError(error: HttpErrorResponse) {
    this._error.set(error);
  }

  clearError() {
    this._error.set(null);
  }

}
