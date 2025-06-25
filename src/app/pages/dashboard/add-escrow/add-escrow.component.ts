import { Component, inject, OnInit } from '@angular/core';
import { EscrowService } from '../../../services/escrow.service';
import { CommonModule } from '@angular/common';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AgreementComponent } from './agreement/agreement.component';
import { DepositComponent } from './deposit/deposit.component';
import { ReleaseConditionComponent } from './release-condition/release-condition.component';
import { DepositPhysicalComponent } from './deposit-physical/deposit-physical.component';

@Component({
    selector: 'app-add-escrow',
    imports: [CommonModule, BasicDetailsComponent, AgreementComponent, DepositComponent, 
        ReleaseConditionComponent,DepositPhysicalComponent],
    templateUrl: './add-escrow.component.html',
    styleUrl: './add-escrow.component.scss'
})
export class AddEscrowComponent implements OnInit {
    private _EscrowService = inject(EscrowService);
    selectedService: any = 'Physical';
    constructor() {
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            if (serviceKey) {
                this.selectedService = serviceKey
            } else {
                this.selectedService = 'Physical'
            }

        });
    }
    tabs = [
        { key: 'basic', label: 'Basic Details', icon: 'assets/img/basic.png' },
        { key: 'agreement', label: 'Agreement', icon: 'assets/img/agreement.png' },
        { key: 'deposit', label: 'Deposit', icon: 'assets/img/deposit.png' },
        { key: 'release', label: 'Release Condition', icon: 'assets/img/release-condition.png' }
    ];
    selectedTab: string = 'basic';
    enabledTabs: { [key: string]: boolean } = {
        basic: true,
        agreement: true,
        deposit: true,
        release: true
    };

    ngOnInit(): void {

    }
    selectTab(tabKey: string) {
        if (this.enabledTabs[tabKey]) {
            this.selectedTab = tabKey;
        }
    }
    enableNextTab(currentKey: string) {
        const currentIndex = this.tabs.findIndex(tab => tab.key == currentKey);
        const nextTab = this.tabs[currentIndex + 1];
        if (nextTab) {
            this.enabledTabs[nextTab.key] = true;
            this.selectedTab = nextTab.key;
        }
    }
}
