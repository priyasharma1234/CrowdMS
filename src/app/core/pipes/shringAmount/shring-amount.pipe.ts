import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shringAmount'
})
export class ShringAmountPipe implements PipeTransform {
  static instance: ShringAmountPipe;
  constructor(){
    // ShringAmountPipe.instance = this
  }

  transform(value: any, cs?: any): any {
    // console.log("pipe val ", value);


    var val: any = Math.abs(value);

    if (val >= 10000000) {
      val = (val / 10000000).toFixed(2) + ' Cr';
    }
    else if (val >= 100000) {
      val = (val / 100000).toFixed(2) + ' Lac';
    }
    else if (val >= 1000) {
      // val = 'Rs.' +(val).toFixed(2) ;
      val = Math.round(val);
    }
    if (value < 0) {
      if (typeof val === 'string') {
        return '-' + val;
      }

      return -Math.abs(val);
    }
    return val;
  };



}
