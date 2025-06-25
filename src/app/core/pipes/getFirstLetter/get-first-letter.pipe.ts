import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFirstLetter'
})
export class GetFirstLetterPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let strStack: string[] = value.split(" ");
    let ttlStr: string = '';
    strStack.forEach((e: string) => {
      ttlStr = ttlStr + e.slice(0, 1);
    })
    ttlStr = ttlStr.slice(0, 2);
    return ttlStr;
  }

}
