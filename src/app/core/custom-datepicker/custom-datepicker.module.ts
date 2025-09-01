import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatepickerComponent } from './custom-datepicker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    BsDatepickerModule
  ]
})
export class CustomDatepickerModule { }
