import {Component, inject} from '@angular/core';
import {ToastService} from '@app/services/toast.service';
import {NgClass} from '@angular/common';
import {slideInOutAnimation} from '@app/animations/slide-in-out.animation';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  animations: [slideInOutAnimation]
})
export class ToastComponent {

  readonly toastService = inject(ToastService);

}
