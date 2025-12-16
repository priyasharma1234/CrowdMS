import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberUnderscore'
})
export class NumberUnderscorePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    console.log("jhgjh", value);

    return (value).replace(/ /g, "_").replace('-', "_").replace('.', "").replace('*', '').toLowerCase();
  }

}
