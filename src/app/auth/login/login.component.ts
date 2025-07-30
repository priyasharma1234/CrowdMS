import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILoginApiPayload, ILoginApiResponse } from './login.types';
import { ApiRequestService } from '../../services/api-request.service';
import { apiRoutes } from '../../config/api-request';
import { AuthCoreService } from '../../services/auth-core.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { UppercaseDirective } from 'src/app/core/directives/uppercase/uppercase.directive';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    UppercaseDirective
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;


  constructor(
    private _formBuilder: FormBuilder,
    private _ApiRequestService: ApiRequestService,
    private _AuthCoreService: AuthCoreService,
    private _Router: Router,
    private _NgxToasterService: NgxToasterService
  ) {
    this.loginForm = this._formBuilder.group({
      userId: [''],
      password: ['']
    });
  }

  Login() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      const payload: ILoginApiPayload = { username: this.loginForm.value.userId ?? "", password: this.loginForm.value.password ?? "" };
      this._ApiRequestService.postData<ILoginApiPayload, ILoginApiResponse>({ payload: payload }, apiRoutes.auth.login).subscribe(res => {
        if (res.statuscode == 200) {
          this._AuthCoreService.SetUser(res.data.user, res.data.token);
           this._NgxToasterService.showSuccess(res?.message, 'Success');
          this._Router.navigate(['/dashboard']);
        } else {
          this._NgxToasterService.showError(res?.message ?? res['data'][0], 'Error');
        }
      });
    }

  }



}
