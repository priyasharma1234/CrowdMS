import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inr'
})
export class InrPipe implements PipeTransform {

  transform(value: number | string | undefined, ...args: any[]): string {
    if (value == undefined) {
      return '';
    }
    if (typeof value === 'string') {
      let v = parseFloat(value);
      if (isNaN(v)) {
        return value;
      }
      value = v;
    }
    return value.toLocaleString('en-in', {style: 'currency', currency: 'INR'});
  }

}
