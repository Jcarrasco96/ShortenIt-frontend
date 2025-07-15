import {animate, style, transition, trigger} from '@angular/animations';

export const loadedAnimation = trigger('loaded',[
  transition(':enter', [
    style({ opacity: 0 }),
    animate("500ms", style({ opacity: 1 }))
  ])
]);
