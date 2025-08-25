import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILoginApiPayload, ILoginApiResponse } from './login.types';
import { ApiRequestService } from '../../services/api-request.service';
import { apiRoutes } from '../../config/api-request';
import { AuthCoreService } from '../../services/auth-core.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { UppercaseDirective } from 'src/app/core/directives/uppercase/uppercase.directive';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomDynamicOtpComponent } from 'src/app/core/custom-dynamic-otp/custom-dynamic-otp.component';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    UppercaseDirective,
    CustomDynamicOtpComponent
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  //   @ViewChild('content') modalContentRef!: TemplateRef<any>;
  //   maskMobileNo: string = '';
  //   isResendOtp: boolean = false;

  //   loginForm: FormGroup;
  //   modalRef!: NgbModalRef;
  //   constructor(
  //     private _formBuilder: FormBuilder,
  //     private _ApiRequestService: ApiRequestService,
  //     private _AuthCoreService: AuthCoreService,
  //     private _Router: Router,
  //     private _NgxToasterService: NgxToasterService,
  //     private modalService: NgbModal

  //   ) {
  //     this.loginForm = this._formBuilder.group({
  //       userId: [''],
  //       password: ['']
  //     });
  //   }

  //   Login() {
  //     if (!this.loginForm.valid) {
  //       return;
  //     }
  //     const payload: ILoginApiPayload = { username: this.loginForm.value.userId ?? "", password: this.loginForm.value.password ?? "" };
  //     this.maskMobileNo = 'Please enter the OTP to complete the process. We send a code to +9977655545'
  //     this.OpenOtpModal();

  //   }

  //   OpenOtpModal() {
  //     this.modalRef = this.modalService.open(this.modalContentRef, {
  //       centered: true,
  //       backdrop: 'static',
  //       keyboard: false,
  //       size: 'md',
  //     });
  //   }

  //   VerifyOtp(otp: any) {
  //     console.log(otp);

  //     if (!otp) {
  //       this._NgxToasterService.showInfo('please enter OTP', 'Info');
  //       return;
  //     }
  //     let formData = new FormData();
  //     formData.append('otp', otp);
  //     const payload: ILoginApiPayload = { username: this.loginForm.value.userId ?? "", password: this.loginForm.value.password ?? "" };
  //     this._ApiRequestService.postData<ILoginApiPayload, ILoginApiResponse>({ payload: payload }, apiRoutes.auth.login).subscribe(res => {
  //       if (res.statuscode == 200) {
  //         this.handleCloseModal();
  //         this._NgxToasterService.showSuccess(res?.message, 'Success');
  //         this._AuthCoreService.SetUser(res.data.user, res.data.token);
  //         this._Router.navigate(['/dashboard']);
  //       } else {
  //         this._NgxToasterService.showError(res?.message ?? res['data'][0], 'Error');
  //       }
  //     });
  //   }

  //   async SendOTP(isResendOtp?: boolean) {
  //     this.isResendOtp = true;
  //     // this.Login();
  //   }

  //   handleCloseModal() {
  //     this.modalRef.close();
  //   }

  // }
  @ViewChild('content') modalContentRef!: TemplateRef<any>;
  maskMobileNo: string = '';
  isResendOtp: boolean = false;

  loginForm: FormGroup;
  modalRef!: NgbModalRef;
  loginToken!: string;
  longitude: any;
  latitude: any;
  constructor(
    private _formBuilder: FormBuilder,
    private _ApiRequestService: ApiRequestService,
    private _AuthCoreService: AuthCoreService,
    private _Router: Router,
    private _NgxToasterService: NgxToasterService,
    private modalService: NgbModal,
    private _LocationService: LocationService

  ) {
    this._LocationService.seterLocation.subscribe((letLang: any) => {
      if (letLang) {
        this.longitude = letLang.long;
        this.latitude = letLang?.lat;
      }
    })
    this.loginForm = this._formBuilder.group({
      userId: [''],
      password: ['']
    });
  }

  Login() {
    if (!this.loginForm.valid) {
      return;
    }
    const payload: ILoginApiPayload = {
      username: this.loginForm.value.userId ?? "", password: this.loginForm.value.password ?? ""
      , longitude: this.longitude ?? 0,
      latitude: this.latitude ?? 0
    };
    this._ApiRequestService.postData<ILoginApiPayload, ILoginApiResponse>({ payload: payload }, apiRoutes.auth.login).subscribe(res => {
      if (res.statuscode == 200) {
        this.loginToken = res.data.token;
        // this._NgxToasterService.showSuccess(res?.message, 'Success');
        this._AuthCoreService.SetUser(res.data.user, res.data.token);
        const phone = (res.data?.user?.phone)?.toString() || '';
        const maskedPhone = '*'.repeat(Math.max(0, phone.length - 4)) + phone.slice(-4);
        //     let maskMobile = res.data?.user?.phone?.toString() ?? '';
        // maskMobile = maskMobile.slice(0, -4) + maskMobile.slice(-4).replace(/\d/g, '*');
        // this._Router.navigate(['/dashboard']);
        this.maskMobileNo = `Please enter the OTP to complete the process. We send a code to ${maskedPhone}`;
        this.OpenOtpModal();
      } else {
        this._NgxToasterService.showError(res?.message ?? res['data'][0], 'Error');
      }
    });


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
    console.log(otp);

    if (!otp) {
      this._NgxToasterService.showInfo('please enter OTP', 'Info');
      return;
    }
    let formData = new FormData();
    formData.append('otp', otp);
    const payload = {
      username: this.loginForm.value.userId ?? "",
      password: this.loginForm.value.password ?? "",
      otp: otp,
    };
    this._ApiRequestService.postData({ payload: payload }, apiRoutes.auth.verifyOtp).subscribe((res: any) => {
      if (res.statuscode == 200) {
        this.handleCloseModal();
        this._NgxToasterService.showSuccess(res?.message, 'Success');
        this._AuthCoreService.SetUser(res.data.user, res.data.token);
        this._Router.navigate(['/dashboard']);
      } else {
        this._NgxToasterService.showError(res?.message ?? res['data'][0], 'Error');
      }
    });
  }

  async SendOTP(isResendOtp?: boolean) {
    this.isResendOtp = true;
    // this.Login();
  }

  handleCloseModal() {
    this.modalRef.close();
  }

}

