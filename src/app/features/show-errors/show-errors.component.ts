import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-show-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-errors.component.html',
  styleUrl: './show-errors.component.scss'
})
export class ShowErrorsComponent implements OnInit {
  @Input() ctrl: any;
  @Input() setErrorMessage: {} = {};
  @Input() requiredMesg: string = 'required';
  @Input() patternMesg: string = 'Pattern not valid';
  @Input() showErrorWithoutTouched: boolean = false;
  ERROR_MESSAGE: ValidationErrors = {
    required: () => this.requiredMesg,
    // maxAge: () => `Age should be greather then 18.`,
    pattern: () => this.patternMesg,
    minlength: (par: any) => `Min ${par.requiredLength} characters is required`,
    min: (min: any) => `Min  ${min.min} amount is required.`,
    maxlength: (par: any) => `Max ${par.requiredLength} characters are allowed`,
    ptDate: () => 'Enter Valid Date',
    specialcharacters: () => `special characters not allowed`,
    // email: () => `Please Enter Valid Email Id`
    dynError: (v: any) => `${v}`
  };

  constructor() { }

  ngOnInit() {

    this.ERROR_MESSAGE = _.assign({}, this.ERROR_MESSAGE, this.setErrorMessage);
  }

  shouldShowErrors() {
    return this.ctrl && this.ctrl.errors && (this.ctrl.touched || this.showErrorWithoutTouched)
  }

  listOfErrors() {
    return Object.keys(this.ctrl.errors).map((err: any) => {

      return this.ERROR_MESSAGE[err] ? this.ERROR_MESSAGE[err](this.ctrl.getError(err)) : this.ctrl.getError(err);
    });
  }
  getTypeOf(error: any) {

    return typeof error
  }
}
