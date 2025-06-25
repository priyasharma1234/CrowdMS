import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filter: string): any[] {
    if (!items) return [];
    if (!filter) return items;

    return items.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key]).toLowerCase().includes(filter.toLowerCase());
      });
    });
  }

}
