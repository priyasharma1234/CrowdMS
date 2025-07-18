import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiRequestService } from '../../../services/api-request.service';
import { apiRoutes } from '../../../config/api-request';
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { environment } from '../../../../environments/environment';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
    selector: 'app-dashboard-list',
    imports: [RouterModule, SharedModule, DynamicTableModule],
    standalone: true,
    templateUrl: './dashboard-list.component.html',
    styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
    httpHeaders: any;
    dashboardData: any;
    private _NgxToasterService = inject(NgxToasterService)
    private _EditEscrowService = inject(EditEscrowService)
    private _CommonService = inject(CommonService)
    constructor(private _ApiRequestService: ApiRequestService, private router: Router) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
        this._CommonService.pageTitle.next('Dashboard');
    }

    ngOnInit() {
        this.getDashboardData()
    }
    addNew() {
        this.router.navigate(['/dashboard/select-service']);
    }
    onTableAction(event: any) {
        console.log('Table action triggered:', event);
        if (event.type === 'edit') {
            if (['DRAFT', 'BENEFICIARY_ONBOARDING_CORRECTIONS', 'DEPOSITOR_ONBOARDING_CORRECTIONS'].includes(event?.row?.stage)) {
                this.router.navigate(['/dashboard/edit-escrow', event?.row?.id]);
            } else if (['ACTIVE', 'RELEASE', 'EXIT'].includes(event?.row?.stage)) {
                this._EditEscrowService.GetEscrowDetails(event?.row?.id).then(res => {
                   if (['ACTIVE', 'RELEASE', 'EXIT'].includes(event?.row?.stage)) {
                        this.router.navigate(['dashboard/edit'])
                        return;
                    }
                });
            }
        }
    }
    async getDashboardData() {
        await this._ApiRequestService.postData({}, apiRoutes.escrow.dashboardCount)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        this.dashboardData = res?.data;
                        console.log("dashboardCount", this.dashboardData)
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

    protected readonly environment = environment;
}
