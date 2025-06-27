import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { ApiRequestService } from '../../../services/api-request.service';
import { apiRoutes } from '../../../config/api-request';
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
@Component({
  selector: 'app-dashboard-list',
  imports: [RouterModule, SharedModule, DynamicTableModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
  httpHeaders: any;
  constructor(private _ApiRequestService: ApiRequestService, private router: Router) {
    // this._ApiRequestService.postData({}, apiRoutes.escrow.list).subscribe(res => console.log(res));
    this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
    console.log("httpHeaders", this.httpHeaders)

  }

  ngOnInit() {
  }
  addNew() {
    this.router.navigate(['/dashboard/select-service']);
  }
  onTableAction(event: any) {
    console.log('Table action triggered:', event);
    if (event.type === 'edit') {
      this.router.navigate(['/dashboard/add-escrow']);
    } 
  }
}
