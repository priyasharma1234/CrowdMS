import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableCellComponent } from './dynamic-table-cell.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {PipesModule} from "@core/pipes/pipes.module";

@NgModule({
    declarations: [
        DynamicTableCellComponent
    ],
    exports: [
        DynamicTableCellComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedModule,
        PipesModule,
    ]
})
export class DynamicTableCellModule { }
