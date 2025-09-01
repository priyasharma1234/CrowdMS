import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionServiceService } from 'src/app/core/services/permission-service.service';
import { apiRoutes } from 'src/app/config/api-request';
import { filter, pipe } from 'rxjs';

@Component({
  standalone: true,
  imports: [SharedModule, OverlayModule, NgbTooltipModule, TooltipModule],
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
})
export class PermissionListComponent implements OnInit {
  // isProduction = environment.production;
  @Input() permissionInput: any;
  @Input() canSet: boolean = false;
  @Input() type: string;
  @Output() emitter = new EventEmitter<string>();
  deleteMode: boolean = false;
  get debug(): any {
    return this._debug;
  }

  set debug(value: any) {
    console.log(value);
    this._debug = value;
  }

  permissions: any;
  isOpen: any = false;
  isCustom: boolean = false;
  selectedModule: any;
  customPermission: any = {
    module: '',
    name: '',
  };
  permissionToAdd: any;
  private _debug: any;
  canDelete: boolean = false;
  constructor(
    private _apiRequestService: ApiRequestService,
    private toaster: NgxToasterService,
    public permissionService: PermissionService,
    public permissionServiceService: PermissionServiceService
  ) {
  
  }

  async ngOnInit() {
    await this.getPermissionList();

    // this.canDelete = (await this._apiRequestService.postDataAsync({}, config.permissions.canDelete)).status;
  }

  async handleDelete(permission: any) {
    console.log(
      'In delete functionn and ',
      this.deleteMode,
      'with permission ',
      permission
    );
    if (!this.deleteMode) return;
    let res: any = await this._apiRequestService.postDataAsync(
      { name: permission.name, guard_name: 'admin' },
      apiRoutes.permissions.removePermission
    );
    if (res.statuscode == 200) {
      this.toaster.showSuccess('Permission Removed Successfully', 'Success');
      await this.getPermissionList();
    }
  }

  private async getPermissionList() {
    let res = await this._apiRequestService.postDataAsync(
      { guard_name: 'admin' },
      apiRoutes.permissions.permissionList
    );
    if (res.statuscode == 200) {
      this.permissions = res.data;
      this.permissions.forEach(
        (per: any) =>
          (per.permissions = per.permission.map((t: any) => {
            let temp = t;
            return {
              nameDisplay: temp.replace(per.module + '-', ''),
              enabled: false,
              name: t,
            };
          }))
      );
      if (this.permissionInput != undefined) {
        this.permissions = this.permissionInput;
      }
      this.emitter.emit(this.permissions);
    }
  }
  async AddPermission() {
    let data = await this._apiRequestService.postDataAsync(
      { name: this.permissionToAdd, guard_name: 'admin' },
      apiRoutes.permissions.permissionCreate
    );
    if (data.statuscode == 200) {
      this.toaster.showSuccess('Permission Added Successfully', 'Success');
      await this.getPermissionList();
      this.isOpen = false;
    }
  }

  async AddCustomPermission() {
    let data = await this._apiRequestService.postDataAsync(
      { ...this.customPermission, guard_name: 'admin' },
      apiRoutes.permissions.customPermissionCreate
    );
    if (data.statuscode == 200) {
      this.toaster.showSuccess('Permission Added Successfully', 'Success');
      await this.getPermissionList();
      this.isCustom = false;
    } else {
      this.toaster.showError(data.message, 'Error');
    }
  }

  moduleEnable(module: any) {
    if (!this.canSet || module.Off != undefined) return;
    // module.enabled = (!module?.enabled) ?? true
    module.enabled = !(module?.enabled ?? false);
    module.permissions.map((t: any) => (t.enabled = module.enabled));
    this.emitter.emit(this.permissions);
  }

  permissionEnable(permission: any, module: any, event?: any) {
    if (this.deleteMode) {
      this.handleDelete(permission);
      return;
    }
    if (!this.canSet || permission.Off != undefined) return;
    permission.enabled = event?.target.checked ?? !permission.enabled ?? true;
    this.checkModule(module);
    this.emitter.emit(this.permissions);
  }

  private checkModule(module: any) {
    let allEnabled = true;
    module.permissions.forEach((per: any) => {
      if (!per.enabled) {
        allEnabled = false;
      }
    });
    module.enabled = allEnabled;
  }
}
