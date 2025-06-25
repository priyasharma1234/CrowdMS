import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {IDynamicTableOptions} from '../dynamic-table-types';
import { DynamicTableService } from '../dynamic-table.service';

@Component({
  selector: 'app-dynamic-table-pagination',
  templateUrl: './dynamic-table-pagination.component.html',
  styleUrls: ['./dynamic-table-pagination.component.scss']
})
export class DynamicTablePaginationComponent implements OnInit {

  @Input() dynamicTableOptions!: IDynamicTableOptions;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() viewNewPagination: 'oldPagination' | 'newPagination' = 'oldPagination';
  constructor(
    public _DynamicTableService: DynamicTableService
  ) {}

  ngOnInit(){
  }


  // dtUpdateByPagination(val: any, dynamicTableOptions: IDynamicTableOptions) {
  //   this._DynamicTableService.dtUpdateByPagination(val, dynamicTableOptions);
  // }

  dtUpdateByPagination(val: any, dynamicTableOptions: IDynamicTableOptions) {
    this._DynamicTableService.dtUpdateByPagination(val, dynamicTableOptions);
    this.updateVisiblePages(this.dynamicTableOptions.pagination!.totalPages)
  }
  updateVisiblePages(totalPages: any) {
    const currentPage = this.dynamicTableOptions.pagination!.currentPage;
    let visiblePages: any[] = [];
    if (totalPages <= 3) {
      visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 2) {
        visiblePages = [1, 2, 3];
      } else if (currentPage >= totalPages - 1) {
        visiblePages = [totalPages - 2, totalPages - 1, totalPages];
      } else {
        visiblePages = [currentPage - 1, currentPage, currentPage + 1];
      }
    }
    // Adding previous options if applicable
    // const prevOptions: any[] = [];
    // if (currentPage > 1) {
    //   prevOptions.push('In');
    //   prevOptions.push('Out');
    // }

    // Combining previous options and visible pages
    // return [...prevOptions, ...visiblePages];
    return [...visiblePages];
  }
}
