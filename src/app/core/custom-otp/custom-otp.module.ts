import { NgModule } from '@angular/core';
import { CustomOtpComponent } from './custom-otp.component';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [CustomOtpComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [CustomOtpComponent],
})
export class CustomOtpModule { }
