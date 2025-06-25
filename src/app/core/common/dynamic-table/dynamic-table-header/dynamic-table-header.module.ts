import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableHeaderComponent } from './dynamic-table-header.component';
import {SharedModule} from "@shared/shared.module";



@NgModule({
    declarations: [
        DynamicTableHeaderComponent
    ],
    exports: [
        DynamicTableHeaderComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class DynamicTableHeaderModule { }
