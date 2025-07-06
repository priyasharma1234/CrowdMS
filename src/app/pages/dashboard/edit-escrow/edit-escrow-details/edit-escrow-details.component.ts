import { Component } from '@angular/core';
import { ViewAgreementComponent } from './view-agreement/view-agreement.component';
import { ViewBasicDetailsComponent } from './view-basic-details/view-basic-details.component';
import { ViewCertificateComponent } from './view-certificate/view-certificate.component';
import { ViewDepositComponent } from './view-deposit/view-deposit.component';
import { ViewReleaseComponent } from './view-release/view-release.component';
import { ViewTeammembersComponent } from './view-teammembers/view-teammembers.component';

@Component({
  selector: 'app-edit-escrow-details',
  imports: [ViewAgreementComponent,ViewBasicDetailsComponent,ViewCertificateComponent,ViewDepositComponent,
    ViewReleaseComponent,ViewTeammembersComponent],
  templateUrl: './edit-escrow-details.component.html',
  styleUrl: './edit-escrow-details.component.scss'
})
export class EditEscrowDetailsComponent {

}
