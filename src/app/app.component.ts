import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {echo} from './services/echo.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { apiRoutes } from './config/api-request';
import { ApiRequestService } from './services/api-request.service';
import { AuthCoreService } from './services/auth-core.service';




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
// constructor(
//     private _ApiRequestService: ApiRequestService,
//     private _authCoreService: AuthCoreService
//   ) {
    // this._ApiRequestService.postDataWithoutBase({},'https://api_uat.sprintexcode.in/should-encrypt')?.subscribe((res:any)=>{
    //   if (res.statuscode == 200) {
    //     if (res.data.encrypt) {
    //       this._authCoreService.encrypted.set(true);
    //     }
    //     else {
    //       this._authCoreService.encrypted.set(false);
    //     }
    //     this.isLoad = true;
    //   }
    //   });
  // }

  title = 'EscrowFrontend';
  // set userid(value: string) {
  //   echo.channel(`escrow.scan.${1}`)
  //     .listen('.SnapshotScanProgressed', (e: any) => {
  //       console.log('Scan update:', e.message);
  //     })
  //     .listen('.SnapshotStored', (e: any) => {
  //       console.log('Snapshot stored:', e.message);
  //     });


  // };



}
