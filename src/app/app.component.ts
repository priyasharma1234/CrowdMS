import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {echo} from './services/echo.service';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EscrowFrontend';
  set userid(value: string) {
    echo.channel(`escrow.scan.${1}`)
      .listen('.SnapshotScanProgressed', (e: any) => {
        console.log('Scan update:', e.message);
      })
      .listen('.SnapshotStored', (e: any) => {
        console.log('Snapshot stored:', e.message);
      });


  };



}
