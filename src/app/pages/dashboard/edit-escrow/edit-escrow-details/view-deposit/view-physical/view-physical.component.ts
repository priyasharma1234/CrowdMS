import { Component } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { IPhysicalDeposit } from '../../../edit-escrow-types';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-view-physical',
  imports: [NgIf,
    FormsModule],
  templateUrl: './view-physical.component.html',
  styleUrl: './view-physical.component.scss'
})
export class ViewPhysicalComponent {
  physicalDetails!: IPhysicalDeposit | undefined;
  escrowId: any
  constructor(
    private _EditEscrowService: EditEscrowService,
    public _FileUploadService: FileUploadService
  ) {
    this.physicalDetails = this._EditEscrowService.escrowDetails?.physical_deposit;
    this.escrowId = this._EditEscrowService.escrowDetails?.id
  }

  ngOnInit(): void {

  }
}
