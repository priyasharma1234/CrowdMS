// import { NewsModule } from './../features/layouts/components/news/news.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CoreDirectivesModule } from '@core/directives/core-directives.module';
// 
// import { DropDownModule } from './drop-down/drop-down.module';
// import { PipesModule } from '@core/pipes/pipes.module';
// import { FileUploadModule } from './components/file-upload/file-upload.module';
// import { CustomDynamicOtpModule } from './components/custom-dynamic-otp/custom-dynamic-otp.module';
// import { PytCustTblPagerDirective } from './components/pytCustTbl/pytPagination/pyt-cust-tbl-pager.directive';
// import { PytTblTopBoxComponent } from './components/pytCustTbl/pyt-tbl-top-box/pyt-tbl-top-box.component';
// import { PytPaginationComponent } from './components/pytCustTbl/pytPagination/pyt-pagination/pyt-pagination.component';
// import { ShowMessageModule } from './components/show-message/show-message.module';
// import { ShowErrorsModule } from '@features/show-errors/show-errors.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowErrorsComponent } from '../features/show-errors/show-errors.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerModule } from '../core/custom-datepicker/custom-datepicker.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
// import { AutocompleteLibModule } from 'angular-ng-autocomplete';
// import { HttpClientModule } from '@angular/common/http';
// import { ShowErrorsComponent } from '@features/show-errors/show-errors.component';
// import { CoreDirectivesModule } from '@core/directives/core-directives.module';
// import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
// import { DynamicSearchComponent } from '@core/common/dynamic-search/dynamic-search.component';
// import { CustomDatepickerModule } from '@core/custom-datepicker/custom-datepicker.module';
// import { CdkDropDownModule } from '@features/customCDK/cdk-drop-down/cdk-drop-down.module';
import { NgSelectModule } from '@ng-select/ng-select';
// import { DynamicOtpModule } from './components/dynamic-otp/dynamic-otp.module';
// import { CustomDatepickerModule } from '@core/custom-datepicker/custom-datepicker.module';
// import { NgOtpInputModule } from 'ng-otp-input';
// import { UploadDocumentModule } from './components/upload-document/upload-document.module';
// import { DynPolarChartModule } from './dyn-polar-chart/dyn-polar-chart.module';
// import { CustomInputModule } from '@features/custom-input/custom-input.module';
// import { SelectConfirmationModalModule } from './components/select-confirmation-modal/select-confirmation-modal.module';
// import { DocModalModule } from './components/doc-modal/doc-modal.module';
// import { DashInfoBoxComponent } from './components/dash-info-box/dash-info-box.component';
// import { ConnectedBankingModalModule } from './components/connected-banking-modal/connected-banking-modal.module';
// import { SliderToggleModule } from '@features/slider-toggle/slider-toggle.module';
// import { PytFilterPipe } from './components/pytCustTbl/pyt-tbl-pipe/pyt-filter.pipe';
// import { VpaConfirmationModalModule } from './components/vpa-confirmation-modal/vpa-confirmation-modal.module';

// import { NgxMaskModule } from 'ngx-mask'
// import { NgToggleModule } from 'ng-toggle-button';

@NgModule({
  declarations: [
    // PytCustTblPagerDirective,
    // PytTblTopBoxComponent,
    // PytPaginationComponent,
    // DashInfoBoxComponent,
    // PytFilterPipe,
    //  DynamicSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShowErrorsComponent,
    NgbModule,
    // NgbAccordionModule,
     CustomDatepickerModule,
    BsDatepickerModule.forRoot(),
    // PipesModule,
    // RouterModule,
    // ToastrModule.forRoot({
    //   autoDismiss: false, maxOpened: 1, preventDuplicates: true,
    //   positionClass: 'toast-bottom-center', closeButton: true,
    // }),
     HttpClientModule,
    //  CdkDropDownModule,
     NgSelectModule,
    // NewsModule,
    // FileUploadModule,
    // CustomDynamicOtpModule,
    // ShowMessageModule,
    // DropDownModule,
    // ShowErrorsModule,
    // NgbModule,
    // AutocompleteLibModule,
    // NgOtpInputModule,
    // UploadDocumentModule,
    // DynPolarChartModule,
    // NgbModalModule,
    // CustomInputModule,
    // SelectConfirmationModalModule,
    // DocModalModule,
    // ConnectedBankingModalModule,
    // NgToggleModule
    // SliderToggleModule,
    // VpaConfirmationModalModule,
    // NgxMaskModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShowErrorsComponent,
    // NgbAccordionModule,
     CustomDatepickerModule,
    // PipesModule,
    RouterModule,
    NgSelectModule,
    // ToastrModule,
    HttpClientModule,
      //  CdkDropDownModule,
    // NewsModule,
    // FileUploadModule,
    // CustomDynamicOtpModule,
    // PytCustTblPagerDirective,
    // PytTblTopBoxComponent,
    // PytPaginationComponent,
    // ShowMessageModule,
    // DropDownModule,
    // SelectConfirmationModalModule,
    // ShowErrorsModule,
    // NgbModule,
    // AutocompleteLibModule,
    // DynamicOtpModule,
    // NgOtpInputModule,
    // UploadDocumentModule,
    // DynPolarChartModule,
    // NgbModalModule,
    // CustomInputModule,
  
    // DashInfoBoxComponent,
    // ConnectedBankingModalModule,
    // NgToggleModule,
    // SliderToggleModule,
    // PytFilterPipe,
    // VpaConfirmationModalModule,
  
  ]
})
export class SharedModule { }
