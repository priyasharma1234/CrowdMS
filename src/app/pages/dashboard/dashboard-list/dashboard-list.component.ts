import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiRequestService } from '../../../services/api-request.service';
import { apiRoutes } from '../../../config/api-request';
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
    selector: 'app-dashboard-list',
    imports: [RouterModule, SharedModule, DynamicTableModule],
    templateUrl: './dashboard-list.component.html',
    styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
    httpHeaders: any;
    dashboardCount: any;
    private _NgxToasterService = inject(NgxToasterService)
    constructor(private _ApiRequestService: ApiRequestService, private router: Router) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
        console.log("httpHeaders", this.httpHeaders)
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
            this.router.navigate(['/dashboard/edit-escrow', event?.row?.id]);
        }
    }
    async getDashboardData() {
        await this._ApiRequestService.postData({}, apiRoutes.escrow.dashboardCount)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        this.dashboardCount = res?.data;
                        console.log("dashboardCount", this.dashboardCount)
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
