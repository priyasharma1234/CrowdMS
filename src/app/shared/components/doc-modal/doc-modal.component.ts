import { CommonModule } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { SafeUrlPipe } from '@core/pipes/safe-url/safe-url.pipe';
import { ConfirmationModalOverlayRef } from '@features/customCDK/cdkCustomMdl/classes/confirmation-modal.ref';
import { ConfirmationModalData } from '@features/customCDK/cdkCustomMdl/interfaces/confirmation-modal-data';
import { CONFIRMATION_MODAL_DATA } from '@features/customCDK/cdkCustomMdl/tokens/confirmation-data.token';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-doc-modal',
  standalone:true,
   imports: [
      CommonModule,
      SharedModule,
      SafeUrlPipe
    ],
  templateUrl: './doc-modal.component.html',
  styleUrls: ['./doc-modal.component.scss']
})
export class DocModalComponent implements OnInit {

  modalSetting: ConfirmationModalData;
  imgExtension:string='';
  constructor(
    public dialogRef: ConfirmationModalOverlayRef,
    @Inject(CONFIRMATION_MODAL_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.modalSetting = this.data.img;
    const splitData=this.data.img.split('.');
    this.imgExtension=(splitData[splitData.length -1]).toLowerCase();
  }
  hideDocModal(){
    this.dialogRef.close();
  }

}
