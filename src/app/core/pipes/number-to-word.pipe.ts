import { Pipe, PipeTransform } from '@angular/core';
import {CommonService} from "@core/services/common.service";

@Pipe({
  name: 'numberToWord'
})
export class NumberToWordPipe implements PipeTransform {

  constructor(private commonService: CommonService) {
  }
  transform(value: any, ...args: unknown[]): string {
    return this.commonService.convertNumberToWords(value);
  }

}
