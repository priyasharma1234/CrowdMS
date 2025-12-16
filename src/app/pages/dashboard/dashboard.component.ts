import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SidebarService } from '../sidebar/sidebar-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent implements OnInit {
  private _SessionStorageService = inject(SessionStorageService);
  private _SidebarService = inject(SidebarService)
  private _CommonService = inject(CommonService);

  ngOnInit() {
     this._SidebarService.selectedItemActive = 'Overview';
    this._SessionStorageService.setItem('selectd_item', 'Overview');
    this._CommonService.pageTitle.next('Overview');
  }

}
