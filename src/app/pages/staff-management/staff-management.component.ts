import { Component, inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SidebarService } from '../sidebar/sidebar-service.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss'
})
export class StaffManagementComponent implements OnInit{
  private _SessionStorageService = inject(SessionStorageService);
  private _CommonService = inject(CommonService);
  private _SidebarService = inject(SidebarService)
  ngOnInit(): void {
    this._SidebarService.selectedItemActive = 'Staff Management';
    this._SessionStorageService.setItem('selectd_item', 'Staff Management');
       this._CommonService.pageTitle.next('Staff Management');
  }

}
