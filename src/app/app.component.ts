import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {echo} from './services/echo.service';
import { LoaderComponent } from './shared/components/loader/loader.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule,LoaderComponent],
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
