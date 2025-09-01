import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EscrowService } from '../../../services/escrow.service';
import { CommonModule } from '@angular/common';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AgreementComponent } from './agreement/agreement.component';
import { DepositComponent } from './deposit/deposit.component';
import { ReleaseConditionComponent } from './release-condition/release-condition.component';
import { DepositPhysicalComponent } from './deposit-physical/deposit-physical.component';
import { ActivatedRoute, Router } from '@angular/router';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/core/guards/exit.guard';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
    selector: 'app-add-escrow',
    imports: [CommonModule, BasicDetailsComponent, AgreementComponent, DepositComponent,
        ReleaseConditionComponent, DepositPhysicalComponent],
    templateUrl: './add-escrow.component.html',
    styleUrl: './add-escrow.component.scss'
})

export class AddEscrowComponent implements OnInit, OnDestroy, CanComponentDeactivate {
      static hasLoadedOnce = false;
    @ViewChild('agreementComp') agreementComp!: AgreementComponent;
    @ViewChild('depositComp') depositComp!: DepositComponent;
    @ViewChild('depositPhyComp') depositPhyComp!: DepositPhysicalComponent;
    @ViewChild('realseComp') realseComp!: ReleaseConditionComponent;
    private m_unsavedChanges: boolean = false;
    private _EscrowService = inject(EscrowService);
    private route = inject(ActivatedRoute);
    selectedService: any = '';
    escrowData: any;
    escrowId: any;
    private _ApiRequestService = inject(ApiRequestService);
    private _NgxToasterService = inject(NgxToasterService);
    private _CommonService = inject(CommonService)
    constructor(private router: Router) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.escrowId = id
            this.getEscrowData(id);
            this._EscrowService.setEscrowId(id)
        }
        console.log('Received ID:', id);

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
//             AddEscrowComponent.hasLoadedOnce = false;
//   const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

//     const isReload = navEntry?.type === 'reload';

//     if (isReload && AddEscrowComponent.hasLoadedOnce) {
//       this.router.navigate(['/dashboard']);
//     }

//     AddEscrowComponent.hasLoadedOnce = true;
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            console.log('SERVICE KEY from observable', serviceKey);
            if (serviceKey) {
                this.selectedService = serviceKey
            }
            let pageTitle = `${this.selectedService} Escrow`;
            this._CommonService.pageTitle.next(pageTitle);

            console.log('Before reload:', localStorage.getItem('selected_service'));
            console.log('After reload:', localStorage.getItem('selected_service'));


        });
        const id = this.route.snapshot.paramMap.get('id');
        console.log('Received ID:', id);


    }
    ngAfterViewInit(): void {
        this.agreementComp?.agreementForm?.valueChanges?.subscribe(() => {
            this.m_unsavedChanges = true;
        });
        if (this.selectedService == 'Software') {
            this.depositComp?.depositForm?.valueChanges?.subscribe(() => {
                this.m_unsavedChanges = true;
            });
        } else {
            this.depositPhyComp?.depositForm?.valueChanges?.subscribe(() => {
                this.m_unsavedChanges = true;
            });
        }

        this.realseComp?.releaseForm?.valueChanges?.subscribe(() => {
            this.m_unsavedChanges = true;
        });

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
                        this.enabledTabs = {
                            ...this.enabledTabs,
                            agreement: !!this.escrowData?.agreements,
                            deposit: !!this.escrowData?.deposit,
                            release: !!this.escrowData?.release
                        };
                        this._EscrowService.setService(res?.data?.basic_details?.escrow_type);
                        this._EscrowService.setDepositorId(res?.data?.basic_details?.depositor_id);
                        this._EscrowService.setBeneId(res?.data?.basic_details?.beneficiary_id)
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
    canDeactivate(): boolean | Observable<boolean> {
        if (this.m_unsavedChanges) {
            return confirm(
                'You have unsaved changes. Are you sure you want to leave?'
            );
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: BeforeUnloadEvent): void {
        if (this.m_unsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
        this._EscrowService.setDepositorId('');
        this._EscrowService.setBeneId('');
        this._EscrowService.setEscrowId('')
    }

    ngOnDestroy() {
        this._EscrowService.setDepositorId('');
        this._EscrowService.setBeneId('');
        this._EscrowService.setEscrowId('');
        this._EscrowService.clearService();
    }
}
