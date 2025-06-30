import { Component, inject, OnInit } from '@angular/core';
import { ApiRequestService } from '../../services/api-request.service';
import { apiRoutes } from '../../config/api-request';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent implements OnInit {
 private _SessionStorageService = inject(SessionStorageService)
  ngOnInit() {
    this._SessionStorageService.setItem('selectd_item', 'Dashboard');
  }

}
