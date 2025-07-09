import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
// import { EditEscrowService } from '../../../../../services/edit-escrow.service';

@Component({
  selector: 'app-view-basic-details',
  imports: [],
  templateUrl: './view-basic-details.component.html',
  styleUrl: './view-basic-details.component.scss'
})
export class ViewBasicDetailsComponent implements OnInit {
  @Input() userType!: 'depositor' | 'beneficiary';
  companyDetails = {
    name: '',
    address: '',
    cin: '',
    pan: ''
  };

  repDetails = {
    name: '',
    email: '',
    mobile: '',
    altMobile: ''
  };
  constructor(
    private _EditEscrowService: EditEscrowService
  ) {

  }
  ngOnInit() {
      this.loadDetails(); 
  }
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['userType'] && !changes['userType'].firstChange) {
      this.loadDetails();
    }
  }

  private loadDetails(): void {
    const escrowDetails = this._EditEscrowService.escrowDetails;
    console.log("escrowDetails1111111111", escrowDetails);

    if (!this.userType || !escrowDetails || !escrowDetails[this.userType]) return;

    const corp = escrowDetails[this.userType].corporate_details;
    this.companyDetails.name = corp.company_name;
    this.companyDetails.address = corp.company_address;
    this.companyDetails.cin = corp.company_cin;
    this.companyDetails.pan = corp.company_pan;
    this.repDetails.name = corp.rep_name;
    this.repDetails.email = corp.rep_email;
    this.repDetails.mobile = corp.rep_mobile;
    this.repDetails.altMobile = corp.rep_alt_mobile ?? '';
  }

}
