import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EscrowService } from '../../../services/escrow.service';
import { CommonModule } from '@angular/common';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AgreementComponent } from './agreement/agreement.component';
import { DepositComponent } from './deposit/deposit.component';
import { ReleaseConditionComponent } from './release-condition/release-condition.component';
import { DepositPhysicalComponent } from './deposit-physical/deposit-physical.component';
import { ActivatedRoute } from '@angular/router';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';

@Component({
    selector: 'app-add-escrow',
    imports: [CommonModule, BasicDetailsComponent, AgreementComponent, DepositComponent,
        ReleaseConditionComponent, DepositPhysicalComponent],
    templateUrl: './add-escrow.component.html',
    styleUrl: './add-escrow.component.scss'
})
export class AddEscrowComponent implements OnInit, OnDestroy {
    private _EscrowService = inject(EscrowService);
    private route = inject(ActivatedRoute);
    selectedService: any = 'Physical';
    escrowData: any;
    escrowId: any;
    private _ApiRequestService = inject(ApiRequestService);
    private _NgxToasterService = inject(NgxToasterService)
    constructor() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.escrowId = id
            this.getEscrowData(id);
            this._EscrowService.setEscrowId(id)
        }
        console.log('Received ID:', id);
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
        agreement: false,
        deposit: false,
        release: false
    };

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log('Received ID:', id);


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
    async getEscrowData(id: any) {
        await this._ApiRequestService.getData(apiRoutes.escrow.getEscrow, id)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200 && res?.data) {
                        this.escrowData = res?.data;
                        console.log("this.escrowdata", this.escrowData);
                        this._EscrowService.setService(res?.data?.basic_details?.escrow_type);
                        this._EscrowService.setDepositorId(res?.data?.basic_details?.depositor_id);
                        this._EscrowService.setBeneId(res?.data?.basic_details?.beneficiary_id)
                        console.log("escrowData", res.data);

                        this._NgxToasterService.showSuccess(res.message, "Success");
                    } else {
                        this._NgxToasterService.showError(res?.message, "Error");
                    }
                },
                error: (error) => {
                    const errorMsg = error?.error?.message || error?.message;
                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            });
    }
    ngOnDestroy() {
        this._EscrowService.setDepositorId('');
        this._EscrowService.setBeneId('');
        this._EscrowService.setService('');
        this._EscrowService.setEscrowId('')
    }
}
