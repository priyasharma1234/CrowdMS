import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
})
export class AuthComponent {


}
