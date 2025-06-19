import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DynamicTableModule} from '@ciphersquare/dynamic-table';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
    DynamicTableModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
})
export class AuthComponent {


}
