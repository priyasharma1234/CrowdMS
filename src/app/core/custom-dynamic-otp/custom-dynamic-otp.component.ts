import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputRestrictionDirective } from '../directives/InputRestriction/input-restriction.directive';
import { FocusToNextInputDirective } from '../directives/focus-to-next-input.directive';
declare var $: any;
@Component({
  selector: 'app-custom-dynamic-otp',
  templateUrl: './custom-dynamic-otp.component.html',
  styleUrls: ['./custom-dynamic-otp.component.scss'],
    imports: [CommonModule, InputRestrictionDirective, FormsModule, ReactiveFormsModule,
       FocusToNextInputDirective,
      ]
})
export class CustomDynamicOtpComponent implements OnInit {

  @ViewChild('inputDiv', { static: true }) inputDiv!: ElementRef;

  @Input() otpBoxNormal: boolean = false;

  @Input() otpBox: number = 8;

  @Input() isSubmitBtn: boolean = true; //show submit button
  @Input() submitBtnName: any = 'Submit OTP'; //set submit button name
  @Input() submitBtnClass: any = 'btn btn-danger'; //Set classes
  @Output() sendOtp = new EventEmitter<any>(); //otp callback
  @Input() isResendOTP: boolean = true;
  @Output() resendOtp = new EventEmitter();
  @Input() resendOTPCounter: number = 30;
  @Input() dynamicResendCounter: boolean = false;

  @Input() title: any = null; //show mesg send to mobile
  @Input() message: any = null; //show mesg send to mobile
  @Input() resetOtp: boolean = false;
  @Output() resetOtpChange = new EventEmitter<boolean>();
  @Input() onlyMessage: boolean = false;
  @Input() placeholder: string = 'OTP *';
  @Input() subtitle: any = null;
  @Input() cancelBtnName: any = null;

  code!: FormArray;
  normalOtpInp!: FormControl

  count: any;
  constructor(private fb: FormBuilder) {

  }

  checkit() {
    let fullOtp: any = '';
    if (this.otpBoxNormal) {
      let inp: any = this.inputDiv.nativeElement.querySelector('input.isFirst');
      fullOtp = inp.value;
      //console.log(fullOtp);
    } else {
      this.code.value.map((val: any) => {
        fullOtp = fullOtp + val;
      });
    }
    this.sendOtp.emit(fullOtp);
  }
  ngOnInit(): void {
    if (this.otpBoxNormal) {
      this.normalOtpInp = new FormControl(null, [Validators.required, Validators.minLength(this.otpBox)]);
    } else {
      const controls: any[] = [];
      for (let i = 0; i < this.otpBox; i++) {
        controls.push(['', [Validators.required]]);
        // controls.push([i == this.otpBox-1?2:'', [Validators.required]]);
      }
      this.code = this.fb.array(controls);
    }

    this.resendOtpFn(false);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes) {
      // if (this.inputDiv?.nativeElement) {
      setTimeout(() => {
        $($(this.inputDiv.nativeElement)[0]).find('input.isFirst')[0].focus();
      }, 1);
      // }
    }
    if (this.resetOtp) {
      this.code.reset('');
      this.resetOtp = false;
      this.resetOtpChange.emit(this.resetOtp);
    }
  }

  getket(key: any) {
    return (<FormArray>this.code).controls[key] as FormControl;
  }
  numberOnly(event: any, lastItem?: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (lastItem) {
      this.lastFnCall();
    }
    return true;
  }
  lastFnCall() {
    setTimeout(() => {
      this.checkit();
    }, 1);
  }
  resendOtpFn(reset: boolean) {

    if (!this.otpBoxNormal) {
      this.code.reset('');
    } else {
      this.normalOtpInp.reset('');
    }

    setTimeout(() => {
      $($(this.inputDiv?.nativeElement)[0]).find('input.isFirst')[0].focus();
    }, 1);
    let count: number = this.resendOTPCounter;
    let inter = setInterval(() => {
      count -= 1;
      this.count = count;
      if (count == 0) {
        clearInterval(inter);
        this.count = null;
        if (this.dynamicResendCounter) {
          this.resendOTPCounter += 30;
        }
      }
    }, 1000);
    if (reset) {
      this.resendOtp.emit();
    }
  }

}
