import { Component } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { IPhysicalDeposit } from '../../../edit-escrow-types';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-view-physical',
  imports: [NgIf,
    FormsModule],
  templateUrl: './view-physical.component.html',
  styleUrl: './view-physical.component.scss'
})
export class ViewPhysicalComponent {
  physicalDetails!: IPhysicalDeposit | undefined
  constructor(
    private _EditEscrowService: EditEscrowService
  ) {
    this.physicalDetails = this._EditEscrowService.escrowDetails?.physical_deposit;
  }

  ngOnInit(): void {

  }
}
