import { Component } from '@angular/core';
import {ApiRequestService} from '../../services/api-request.service';
import {NgxToasterService} from '../../core/services/toasterNgs.service';
import {Router, RouterLink} from '@angular/router';
import {apiRoutes} from '../../config/api-request';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
})
export class ForgotPasswordComponent {
  userid: any;

  constructor(
    private _ApiRequestService: ApiRequestService,
    private _ToasterService: NgxToasterService,
    private _Router: Router
  ) {
    // Initialize userid if needed
    this.userid = '';
  }

  SubmitForm() {
    this._ApiRequestService.postData({payload: {userid: this.userid}}, apiRoutes.auth.forgotPassword).subscribe(res => {
      if (res.statuscode === 200) {
        this._ToasterService.showSuccess(res.message, 'Success');
        this._Router.navigate(['/auth/login']);
        console.log("Password reset link sent to your email.");
      } else {
        console.error("Error sending password reset link:", res.message);
      }
    });
    console.log("Forgot Password Form Submitted", this.userid);
  }
}
