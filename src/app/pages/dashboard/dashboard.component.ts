import {Component, OnInit} from '@angular/core';
import {ApiRequestService} from '../../services/api-request.service';
import {apiRoutes} from '../../config/api-request';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent implements OnInit{

  constructor(private _ApiRequestService: ApiRequestService) {
    this._ApiRequestService.postData({}, apiRoutes.escrow.list).subscribe(res => console.log(res));

  }
  ngOnInit() {
  }
}
