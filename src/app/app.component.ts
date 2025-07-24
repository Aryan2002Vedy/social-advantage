import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
   ngOnInit() {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });
  }
}
