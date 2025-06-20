import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { ApiRequestService } from '../../../services/api-request.service';
import { apiRoutes } from '../../../config/api-request';
@Component({
  selector: 'app-dashboard-list',
  imports: [RouterModule],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
  constructor(private _ApiRequestService: ApiRequestService, private router: Router) {
    this._ApiRequestService.postData({}, apiRoutes.escrow.list).subscribe(res => console.log(res));

  }
  ngOnInit() {
  }
  addNew() {
    this.router.navigate(['/dashboard/select-service']);
  }
}
