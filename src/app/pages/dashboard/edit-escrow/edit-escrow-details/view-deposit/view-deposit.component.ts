import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { ViewSoftwareComponent } from './view-software/view-software.component';
import { ViewPhysicalComponent } from './view-physical/view-physical.component';

@Component({
  selector: 'app-view-deposit',
  imports: [NgIf,ViewSoftwareComponent,ViewPhysicalComponent,AsyncPipe],
  templateUrl: './view-deposit.component.html',
  styleUrl: './view-deposit.component.scss'
})
export class ViewDepositComponent {

  constructor(public _EditEscrowService: EditEscrowService){}

}
