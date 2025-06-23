import { Component, inject, OnInit } from '@angular/core';
import { EscrowService } from '../../../services/escrow.service';
import { CommonModule } from '@angular/common';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AgreementComponent } from './agreement/agreement.component';
import { DepositComponent } from './deposit/deposit.component';
import { ReleaseConditionComponent } from './release-condition/release-condition.component';

@Component({
  selector: 'app-add-escrow',
  imports: [CommonModule, BasicDetailsComponent, AgreementComponent,DepositComponent,ReleaseConditionComponent],
  templateUrl: './add-escrow.component.html',
  styleUrl: './add-escrow.component.scss'
})
export class AddEscrowComponent implements OnInit {
  private _EscrowService = inject(EscrowService);
  selectedService: any = 'Software';
  constructor() {
    this._EscrowService.getService().subscribe((serviceKey: any) => {
      this.selectedService = serviceKey
      if (serviceKey === 'software') {
        // apply software-specific logic
      } else if (serviceKey === 'physical') {
        // apply physical-specific logic
      }
    });
  }
  tabs = [
    { key: 'basic', label: 'Basic Details' },
    { key: 'agreement', label: 'Agreement' },
    { key: 'deposit', label: 'Deposit' },
    { key: 'release', label: 'Release Condition' }
  ];
  selectedTab: string = 'basic';

  ngOnInit(): void {

  }
  selectTab(key: string) {
    this.selectedTab = key;
  }
}
