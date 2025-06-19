import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';

@Component({
  selector: 'app-pages',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  standalone: true,
})
export class PagesComponent {

}
