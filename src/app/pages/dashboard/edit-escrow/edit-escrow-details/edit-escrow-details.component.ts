import { Component, inject } from '@angular/core';
import { ViewAgreementComponent } from './view-agreement/view-agreement.component';
import { ViewBasicDetailsComponent } from './view-basic-details/view-basic-details.component';
import { ViewCertificateComponent } from './view-certificate/view-certificate.component';
import { ViewDepositComponent } from './view-deposit/view-deposit.component';
import { ViewReleaseComponent } from './view-release/view-release.component';
import { ViewTeammembersComponent } from './view-teammembers/view-teammembers.component';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-escrow-details',
  imports: [ViewAgreementComponent, ViewBasicDetailsComponent, ViewCertificateComponent, ViewDepositComponent,
    ViewReleaseComponent, ViewTeammembersComponent, CommonModule],
  templateUrl: './edit-escrow-details.component.html',
  styleUrl: './edit-escrow-details.component.scss'
})
export class EditEscrowDetailsComponent {
  private _EditEscrowService = inject(EditEscrowService)
  // setTab(tab: 'depositor' | 'beneficiary') {
  //   this._EditEscrowService.selectedTab = tab;
  // }
  activeEntity: 'depositor' | 'beneficiary' = 'depositor';
  activeSubTab: string = 'Basic Details';

  subTabs = [
    { label: 'Basic Details', component: 'basic' },
    { label: 'Agreement', component: 'agreement' },
    { label: 'Team Members', component: 'team' },
    { label: 'Deposit', component: 'deposit' },
    { label: 'Release', component: 'release' },
    // { label: 'Certificate', component: 'certificate' }
  ];

  setEntity(tab: 'depositor' | 'beneficiary') {
    this._EditEscrowService.selectedTab = tab;
    this.activeEntity = tab;
    this.activeSubTab = 'Basic Details';
  }

  setSubTab(tabLabel: string) {
    this.activeSubTab = tabLabel;
  }
}
