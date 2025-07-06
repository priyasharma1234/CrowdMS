import { Component } from '@angular/core';
// import { EditEscrowService } from '../../../../../services/edit-escrow.service';

@Component({
  selector: 'app-view-basic-details',
  imports: [],
  templateUrl: './view-basic-details.component.html',
  styleUrl: './view-basic-details.component.scss'
})
export class ViewBasicDetailsComponent {
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
    // private _EditEscrowService: EditEscrowService
  ) {
    // const escrowDetails = this._EditEscrowService.escrowDetails;
    // const userType = escrowDetails?.user_type;
    // if(userType == undefined) return;
    // if (escrowDetails == undefined) return;
    // this.companyDetails.name = escrowDetails[userType].corporate_details.company_name;
    // this.companyDetails.address = escrowDetails[userType].corporate_details.company_address;
    // this.companyDetails.cin = escrowDetails[userType].corporate_details.company_cin;
    // this.companyDetails.pan = escrowDetails[userType].corporate_details.company_pan;
    // this.repDetails.name = escrowDetails[userType].corporate_details.rep_name;
    // this.repDetails.email = escrowDetails[userType].corporate_details.rep_email;
    // this.repDetails.mobile = escrowDetails[userType].corporate_details.rep_mobile;
    // this.repDetails.altMobile = escrowDetails[userType].corporate_details.rep_alt_mobile ?? '';
  }
}
