import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { LoaderComponent } from './shared/components/loader/loader.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule,LoaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
    public static staticIsLoad = false;

  get isLoad() {
    return AppComponent.staticIsLoad;
  };

  set isLoad(value) {
    AppComponent.staticIsLoad = value;
  }
  title = 'EscrowFrontend';
}
