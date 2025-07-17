import { Component } from '@angular/core';
import {ApiRequestService} from '../../services/api-request.service';
import {NgxToasterService} from '../../core/services/toasterNgs.service';
import {Router, RouterLink} from '@angular/router';
import {apiRoutes} from '../../config/api-request';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-forgot-userid',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-userid.component.html',
  styleUrl: './forgot-userid.component.scss',
  standalone: true,
})
export class ForgotUseridComponent {

  email: any;

  constructor(
    private _ApiRequestService: ApiRequestService,
    private _ToasterService: NgxToasterService,
    private _Router: Router
  ) {
    // Initialize email if needed
    this.email = '';
  }

  SubmitForm() {
    this._ApiRequestService.postData({ payload: { email: this.email } }, apiRoutes.auth.forgotUserId).subscribe(res => {
      if (res.statuscode === 200) {
        this._ToasterService.showSuccess(res.message, 'Success');
        this._Router.navigate(['/auth/login']);
        console.log("Password reset link sent to your email.");
      } else {
        this._ToasterService.showError(res.message, 'Error');
        console.error("Error sending password reset link:", res.message);
      }
    });
    console.log("Forgot Password Form Submitted", this.email);
  }
}
