import {Component} from '@angular/core';
import {environment} from '@environments/environment';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {

  protected environment = environment;

}
