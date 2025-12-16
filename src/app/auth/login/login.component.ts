import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILoginApiPayload, ILoginApiResponse } from './login.types';
import { ApiRequestService } from '../../services/api-request.service';
import { apiRoutes } from '../../config/api-request';
import { AuthCoreService } from '../../services/auth-core.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ShowHidePasswordDirective } from 'src/app/core/directives/show-hide-password.directive';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        ShowHidePasswordDirective
    ],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm: FormGroup;
    loginToken!: string;
    constructor(
        private _formBuilder: FormBuilder,
        private _ApiRequestService: ApiRequestService,
        private _AuthCoreService: AuthCoreService,
        private _Router: Router,
        private _NgxToasterService: NgxToasterService,

    ) {
        this.loginForm = this._formBuilder.group({
            email: [''],
            password: ['']
        });
    }
    ngAfterViewInit(): void {
        const syncAutofill = () => {
            const email = (document.getElementById('name') as HTMLInputElement)?.value;
            const password = (document.getElementById('password') as HTMLInputElement)?.value;

            if (email || password) {
                this.loginForm.patchValue({ email, password }, { emitEvent: false });
                return;
            }
            requestAnimationFrame(syncAutofill);
        };

        requestAnimationFrame(syncAutofill);
    }
    Login() {
        if (!this.loginForm.valid) {
            return;
        }
        const payload: ILoginApiPayload = {
            email: this.loginForm.value?.email ?? "", password: this.loginForm.value.password ?? ""
        };
        this._ApiRequestService.postData<ILoginApiPayload, ILoginApiResponse>({ payload: payload }, apiRoutes.auth.login).subscribe((res: any) => {
            if (res.token) {
                this.loginToken = res?.token;
                     this._AuthCoreService.SetUser(res.token);
                this._Router.navigate(['/dashboard']);
            } else {
                this._NgxToasterService.showError(res?.message ?? res['data'][0], 'Error');
            }
        });

    }

}

