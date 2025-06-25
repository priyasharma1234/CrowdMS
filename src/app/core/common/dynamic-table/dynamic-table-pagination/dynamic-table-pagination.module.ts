import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTablePaginationComponent } from './dynamic-table-pagination.component';
import { DynamicTablePaginationDirective } from './dynamic-table-pagination.directive';



@NgModule({
  declarations: [
    DynamicTablePaginationComponent,
    DynamicTablePaginationDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[
    DynamicTablePaginationComponent,
    DynamicTablePaginationDirective
  ]
})
export class DynamicTablePaginationModule { }
