import { UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';


// function to allowed maximum number
export function maxNumToBeAllowed(event, maxLen) {
  if (event.target.value.length >= maxLen) {
    return false;
  }
  return true;
};
export function validateNumber(event) {
  const keyCode = event.keyCode;

  const excludedKeys = [8, 37, 39, 46];

  if (!((keyCode >= 48 && keyCode <= 57) ||
    (keyCode >= 96 && keyCode <= 105) ||
    (excludedKeys.includes(keyCode)))) {
    event.preventDefault();
  }
}
// function to check account and confirm account number
export function ConfirmedValidator(controlName: string, matchingControlName: string): any {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    // console.log(control)
    const matchingControl = formGroup.controls[matchingControlName];
    // console.log(matchingControl)
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    };
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
};


// function to check age and set error validation if age doesn't satisfied the condition
export function minimumAge(age: number, controlName: string) {
  return (fg: UntypedFormGroup) => {
    let result = fg.controls[controlName];
    let selectedDate: Date = new Date(result.value);

    if (!selectedDate) {
      return
    }

    if (selectedDate) {
      let selected = {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        day: selectedDate.getDay()
      }
      const value: { year: any, month: any, day: any } = selected;

      const date = moment({ year: +value.year, month: (+value.month), day: +value.day }).startOf('day');
      if (date.isValid()) {
        const now = moment().startOf('day');
        const yearsDiff = date.diff(now, 'years');  //   here using moment js to get difference between the dates
        if (yearsDiff > -age) {
          result.setErrors({ minimumAge: true });
        } else {
          result.setErrors(null);
        }
      }
    }
  };
};

// function to generate random numbers
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genString(length) {
  var times = length;
  var key = '';
  while (times > 0) {
    times--;
    key += getRandomInt(0, 9);
  }
  return key;
}

export function chekValueIsNumberOrNot(val) {
  return /^-?\d+$/.test(val);
}
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
  return re.test(email);
}
