import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IResetPasswordElementList, IResetPasswordElementListApiResponse } from './reset-password.type';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { CommonModule } from '@angular/common';
import { CustomDynamicOtpComponent } from 'src/app/core/custom-dynamic-otp/custom-dynamic-otp.component';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { PasswordReg } from 'src/app/core/utility/password-reg';
import { ConfirmedValidator, passwordStrengthValidator } from 'src/app/core/utility/validator';
import { apiRoutes } from 'src/app/config/api-request';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-reset-password',
    imports: [CommonModule, FormsModule,
        ReactiveFormsModule,
        CustomDynamicOtpComponent],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
    @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;
    @ViewChild('content') modalContentRef!: TemplateRef<any>;
    submitted: boolean = false;
    changePasswordForm!: FormGroup;
    showErrorBox = false;
    maskMobileNo: string = '';
    isResendOtp: boolean = false;
    urlToken: any;
    reusedPassword: boolean = false;
    cannotUsername: boolean = false;
    cannotName: boolean = false;
    private subscription$ = new Subject<void>();
    modalRef!: NgbModalRef;
    type: 'reset' | 'create'
    constructor(
        private _Router: Router,
        private _ActivatedRoute: ActivatedRoute,
        private _FormBuilder: FormBuilder,
        private _NgxToasterService: NgxToasterService,
        private _ApiRequestService: ApiRequestService,
        private modalService: NgbModal
    ) {
        const type = this._ActivatedRoute.snapshot.data['type'];
        this.type = type

    }

    ngOnInit(): void {
        this.formInIt();
        this.GetTokenFromUrl();
    }
    GetTokenFromUrl() {
        let data = this._ActivatedRoute.snapshot.queryParams['token'];
        this.urlToken = data;
        if (data) {
            let formData = new FormData();
            formData.append('token', data);
            this._ApiRequestService.postData({ payload: formData }, apiRoutes.auth.resetPasswordVerifyToken).subscribe({
                next: (res: any) => {
                    if (res.statuscode == 200) {
                    } else {
                        this._Router.navigate(['/auth/login']);
                        this._NgxToasterService.showError(res.message, "Error");
                    }
                }, error: (err: any) => {
                }
            })
        } else {
            this._Router.navigate(['/auth/login']);
        }
    }
    formInIt() {
        this.changePasswordForm = this._FormBuilder.group(
            {
                password: [
                    '',
                    [
                        Validators.required,
                        PasswordReg.patternValidator(/\d/, {
                            hasNumber: true,
                        }),
                        // check whether the entered password has upper case letter
                        PasswordReg.patternValidator(/[A-Z]/, {
                            hasCapitalCase: true,
                        }),
                        // check whether the entered password has a lower case letter
                        PasswordReg.patternValidator(/[a-z]/, {
                            hasSmallCase: true,
                        }),
                        // check whether the entered password has a special character
                        PasswordReg.patternValidator(
                            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                            {
                                hasSpecialCharacters: true,
                            }
                        ),

                        PasswordReg.patternValidator(/^.{8,16}$/, {
                            hasValidLength: true,
                        }),

                        Validators.minLength(8), // Must be at least 8 characters
                        passwordStrengthValidator()
                    ],
                ],
                confirm_password: ['', [Validators.required, Validators.minLength(8)]],
                // old_password:['',[Validators.required]],
            },
            { validator: ConfirmedValidator('password', 'confirm_password') }
        );

    }
    get f() {
        return this.changePasswordForm.controls;
    }

    get passwordStrength(): { medium: boolean, strong: boolean, weak: boolean } {
        const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{12,}$/;
        const errors = this.f['password']?.errors;

        // Determine the strength
        const isWeak = errors?.['passwordStrength'] === 'weak';
        const isMedium = !isWeak && mediumRegex.test(this.f['password']?.value);
        const isStrong = !isWeak && strongRegex.test(this.f['password']?.value);

        return {
            weak: isWeak,
            medium: isMedium,
            strong: isStrong
        };
    }

    ReSetPassword(type?: 'resend') {
        this.submitted = true;
        if (this.changePasswordForm.valid) {
            this.showErrorBox = false;
            let formData = new FormData();
            formData.append('type', type ? type : '')
            formData.append('new_password', this.changePasswordForm.value.password)
            formData.append('new_password_confirmation', this.changePasswordForm.value.confirm_password)
            formData.append('token', this.urlToken);
            this._ApiRequestService.postData({ payload: formData }, apiRoutes.auth.resetPasswordVerifyOtp).subscribe({
                next: (res: any) => {
                    if (res) {
                        if (res.statuscode == 200) {
                            this.OpenOtpModal()
                            const phone = res.data.phone;
                            const maskedPhone = phone.replace(/\d(?=\d{4})/g, '*');
                            this.maskMobileNo = `your code is sent to ${maskedPhone}`

                        } else {
                            this._NgxToasterService.showError(res.message, "Error");
                        }
                    }
                }, error: (err: any) => {
                    this._NgxToasterService.showError(err.message, "Error");
                }
            })
        } else {
            this.changePasswordForm.markAllAsTouched();
            // this.showErrorBox = true;
            return
        }
    }
    clearPassword() {
        this._Router.navigate(['/auth/login']);
    }
    OpenOtpModal() {
        this.modalRef = this.modalService.open(this.modalContentRef, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
            size: 'md',
        });
    }

    VerifyOtp(otp: any) {
        if (!otp) {
            this._NgxToasterService.showInfo('please enter OTP', 'Info');
            return;
        }
        let formData = new FormData();
        formData.append('otp', otp);
        formData.append('new_password', this.changePasswordForm.value.password)
        formData.append('new_password_confirmation', this.changePasswordForm.value.confirm_password)
        formData.append('token', this.urlToken);
        this._ApiRequestService.postData({ payload: formData }, apiRoutes.auth.resetPassword).subscribe({
            next: (res: any) => {
                if (res) {
                    if (res.statuscode == 200) {
                        this._NgxToasterService.showSuccess(res.message, 'Success');
                        this.modalRef.close();
                        this._Router.navigate(['/auth/login']);
                    } else {
                        this._NgxToasterService.showError(res.message, 'Error');
                    }
                }
            },
            error: (err: any) => {
                this._NgxToasterService.showError(err.message, 'Error');
            },
        });
    }

    async SendOTP(isResendOtp: boolean) {
        this.ReSetPassword('resend');
    }


    OnBlurPassword(event: any) {
        console.log(event);
    }
    handleCloseModal() {
        this.modalRef.close();
    }

    ngOnDestroy() {
        this.subscription$.next();
        this.subscription$.complete();
        this.urlToken = '';
    }
}
