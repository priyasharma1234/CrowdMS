import { Component } from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import { TopBarComponent } from './top-bar/top-bar.component';

@Component({
  selector: 'app-pages',
  imports: [
    SidebarComponent,
    TopBarComponent
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  standalone: true,
})
export class PagesComponent {

}
