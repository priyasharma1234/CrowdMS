import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    let val: any = value;
    // console.log("replace pipe ", val.replace(/ /g,"_"))
    return val.replace(/ /g,"_").replace('_', " ");
  }

}
