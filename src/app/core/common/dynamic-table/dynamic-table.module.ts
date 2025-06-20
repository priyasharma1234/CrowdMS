import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import {PipesModule} from "@core/pipes/pipes.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DynamicTableCellModule} from "@core/common/dynamic-table/dynamic-table-cell/dynamic-table-cell.module";



@NgModule({
  declarations: [
    DynamicTableComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    DynamicTableCellModule
  ],
  exports: [
      DynamicTableComponent
  ]
})
export class DynamicTableModule { }
