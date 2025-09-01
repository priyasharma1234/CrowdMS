import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeEspecialSymbol'
})
export class RemoveEspecialSymbolPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    // console.log("pipe ",value)
    return value === undefined ? '' : value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
    ;
  }

}
