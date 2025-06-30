import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from './api-request.service';
import { apiRoutes } from '../config/api-request';

@Injectable({
    providedIn: 'root'
})
export class staffService {
    constructor(
        private _ApiRequestService: ApiRequestService
    ) { }
    getRoleList(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.roles.roleList);
    }
    deleteRole(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.roles.roleDelete);
    }
    getStaffRoleList(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.staff.rolelist);
    }
    getStaffList(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.staff.list);
    }
    getStaffById(id: string): Observable<any> {
        const formData = new FormData();
        formData.append('id', id);
        return this._ApiRequestService.postData({ payload: formData }, apiRoutes.staff.show);
    }
    addStaff(params: any): Observable<any> {
        console.log('Params', params)
        return this._ApiRequestService.postData(params, apiRoutes.staff.add);
    }
    updateStaff(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.staff.update);
    }
    deleteStaff(params: any): Observable<any> {
        return this._ApiRequestService.postData(params, apiRoutes.staff.delete);
    }
}
