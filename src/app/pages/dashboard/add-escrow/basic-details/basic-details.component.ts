import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AddEntityModalComponent } from './add-entity-modal/add-entity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EscrowService } from 'src/app/services/escrow.service';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';

@Component({
    selector: 'app-basic-details',
    imports: [CommonModule],
    templateUrl: './basic-details.component.html',
    styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent implements OnInit {
    serviceOptions = [
        {
            title: 'Add Depositor',
            description: 'The software vendor or developer who deposits source code physically and related materials into escrow.',
            icon: 'assets/img/add-depositor-icon.svg',
            key: 'depositor'
        },
        {
            title: 'Add Beneficiary',
            description: 'The licensee or client who gains access to the escrowed materials if release conditions are triggered.',
            icon: 'assets/img/house-icon.svg',
            key: 'beneficiary'
        }
    ];
    depositor: any = null;
    beneficiary: any = null;
    selectedService: any;
    beneId: any;
    depositorId: any;
    private _EscrowService = inject(EscrowService);
    private _NgxToasterService = inject(NgxToasterService);
    private _ApiRequestService = inject(ApiRequestService)
    constructor(private modalService: NgbModal) {
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            this.selectedService = serviceKey
        });
        this._EscrowService.getDepositorId().subscribe((depositorId: any) => {
            this.depositorId = depositorId
        });
        this._EscrowService.getBeneId().subscribe((beneId: any) => {
            this.beneId = beneId
        });
    }
    ngOnInit(): void {

    }
    onSelect(serviceKey: string) {
        const modalRef = this.modalService.open(AddEntityModalComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static', // to prevent close on outside click
        });

        modalRef.componentInstance.entityType = serviceKey;

        if (serviceKey == 'depositor' && this.depositor) {
            modalRef.componentInstance.entityData = this.depositor;
        } else if (serviceKey == 'beneficiary' && this.beneficiary) {
            modalRef.componentInstance.entityData = this.beneficiary;
        }

        modalRef.result.then(
            (result: any) => {
                if (serviceKey == 'depositor') this.depositor = result;
                if (serviceKey == 'beneficiary') this.beneficiary = result;
            },
            () => { }
        );
    }

    editEntity(type: 'depositor' | 'beneficiary') {
        const entityData = type == 'depositor' ? this.depositor : this.beneficiary;
        const modalRef = this.modalService.open(AddEntityModalComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static',
            keyboard: false
        });

        modalRef.componentInstance.entityType = type;
        modalRef.componentInstance.entityData = entityData;

        modalRef.result.then(
            (result: any) => {
                if (type == 'depositor') this.depositor = result;
                else if (type == 'beneficiary') this.beneficiary = result;
            },
            () => { }
        );
    }
    async submit() {
        if (!this.depositorId) {
            this._NgxToasterService.showError("Please add depositor", "Error");
        }
        if (!this.beneId) {
            this._NgxToasterService.showError("Please add beneficiary", "Error");
        }
        const payload = {
            depositor_id: this.depositorId,
            beneficiary_id: this.beneId,
            type: this.selectedService
        };
        await this._ApiRequestService.postData({ payload: payload }, apiRoutes.escrow.add)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        console.log("message")
                        this._NgxToasterService.showSuccess(res.message, "Success");
                    } else {
                        console.log("res", res)
                        this._NgxToasterService.showError(res?.message, "Error");
                    }
                },
                error: (error) => {
                    console.log("error", error)
                    const errorMsg = error?.error?.message || error?.message;
                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            });
    }
}
