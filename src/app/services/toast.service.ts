import {Injectable, signal} from '@angular/core';
import {Toast} from '@app/interfaces/toast';

@Injectable({providedIn: 'root'})
export class ToastService {

  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private show(toast: Toast) {
    this._toasts.update((toasts) => [...toasts, toast]);

    if (toast.delay) {
      setTimeout(() => this.remove(toast), toast.delay);
    }
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }

  success(text: string, delay = 5000) {
    this.show({ text, classname: 'alert-success', delay });
  }

  error(text: string, delay = 5000) {
    this.show({ text, classname: 'alert-danger', delay });
  }

  info(text: string, delay = 5000) {
    this.show({ text, classname: 'alert-info', delay });
  }

  warning(text: string, delay = 5000) {
    this.show({ text, classname: 'alert-warning', delay });
  }

  default(text: string, delay = 5000) {
    this.show({ text, delay });
  }

}
