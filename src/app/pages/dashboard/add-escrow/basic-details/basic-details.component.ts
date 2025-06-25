import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
            icon: 'assets/img/add-depositor.png',
            key: 'depositor'
        },
        {
            title: 'Add Beneficiary',
            description: 'The licensee or client who gains access to the escrowed materials if release conditions are triggered.',
            icon: 'assets/img/add-bene.png',
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
    private _ApiRequestService = inject(ApiRequestService);
    @Output() completed = new EventEmitter<void>();
    constructor(private modalService: NgbModal) {

    }
    ngOnInit(): void {
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            if (serviceKey) {
                this.selectedService = serviceKey
            } else {
                this.selectedService = 'Software'
            }

        });
        this._EscrowService.getDepositorId().subscribe((id: any) => {
            console.log("depositorId", id)
            this.depositorId = id;
            if (id) this.fetchCorporateDetails(id, 'depositor');
        });

        this._EscrowService.getBeneId().subscribe((id: any) => {
            this.beneId = id;
            if (id) this.fetchCorporateDetails(id, 'beneficiary');
        });


    }
    fetchCorporateDetails(id: any, type: 'depositor' | 'beneficiary') {
        // const formData = new FormData();
        // formData.append('id', id);
        this._ApiRequestService.getData(apiRoutes.escrow.getCorporate, id).subscribe({
            next: (res: any) => {
                if (res?.statuscode == 200) {
                    if (type === 'depositor') {
                        this.depositor = res.data;
                    } else if (type === 'beneficiary') {
                        this.beneficiary = res.data;
                    }
                }
            },
            error: (err) => {
               this._NgxToasterService.showError(err?.message, "Error");
            }
        });
    }
    onSelect(type: any) {
        const corpId = type == 'depositor' ? this.depositorId : this.beneId;

        const modalRef = this.modalService.open(AddEntityModalComponent, {
            centered: true,
            size: 'xl',
            backdrop: 'static',
            keyboard: false
        });
        modalRef.componentInstance.entityData = type == 'depositor' ? this.depositor : this.beneficiary;;
        modalRef.componentInstance.entityType = type;
        modalRef.componentInstance.editId = corpId || null;

        modalRef.result.finally(() => {

        });
    }
    async submit() {
        this._EscrowService.getDepositorId().subscribe((id: any) => {
            console.log("deposit", id)
            this.depositorId = id
        });
        this._EscrowService.getBeneId().subscribe((id: any) => {
            console.log("beneId", id)
            this.beneId = id;
        });
        if (!this.depositorId) {
            this._NgxToasterService.showError("Please add depositor", "Error");
            return
        }
        if (!this.beneId) {
            this._NgxToasterService.showError("Please add beneficiary", "Error");
            return
        }
        const payload = {
            depositor_id: this.depositorId,
            beneficiary_id: this.beneId,
            escrow_type: this.selectedService
        };
        await this._ApiRequestService.postData({ payload: payload }, apiRoutes.escrow.add)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        this._EscrowService.setEscrowId(res?.data?.id);
                        this.completed.emit();
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
