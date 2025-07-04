import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EditEscrowDetailsComponent } from './edit-escrow-details/edit-escrow-details.component';

@Component({
    selector: 'app-edit-escrow',
    imports: [CommonModule,RouterModule,EditEscrowDetailsComponent],
    templateUrl: './edit-escrow.component.html',
    styleUrl: './edit-escrow.component.scss'
})
export class EditEscrowComponent implements OnInit {
    escrowId: any;
    escrowDetails: any;
    escrowData: any;
    private _NgxToasterService = inject(NgxToasterService)
    private _ApiRequestService = inject(ApiRequestService)
    constructor(private route: ActivatedRoute) {

    }
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.escrowId = id
            this.getEscrowData(id);
        }
    }
    async getEscrowData(id: any) {
        await this._ApiRequestService.getData(apiRoutes.escrow.getEscrow, id)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200 && res?.data) {
                        this.escrowData = res?.data;
                        console.log("escrowData",this.escrowData)
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
}
