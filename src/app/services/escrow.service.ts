import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiRequestService } from './api-request.service';
import { apiRoutes } from '../config/api-request';

@Injectable({
    providedIn: 'root',
})
export class EscrowService {
    private selectedService$ = new BehaviorSubject<string | null>(null);
    private selectedEscrowID$ = new BehaviorSubject<string | null>(null);
    private selectedDepositorID$ = new BehaviorSubject<string | null>(null);
    private selectedbeneID$ = new BehaviorSubject<string | null>(null);

    private _apiRequestService = inject(ApiRequestService);
    setService(serviceKey: string) {
        this.selectedService$.next(serviceKey);
    }
    getService() {
        return this.selectedService$.asObservable();
    }
    setDepositorId(id: string) {
        this.selectedDepositorID$.next(id);
    }
    getDepositorId() {
        return this.selectedDepositorID$.asObservable();
    }
    setBeneId(id: string) {
        this.selectedbeneID$.next(id);
    }
    getBeneId() {
        return this.selectedbeneID$.asObservable();
    }
    setEscrowId(id: string) {
        this.selectedEscrowID$.next(id);
    }
    getEscrowId() {
        return this.selectedEscrowID$.asObservable();
    }
    getCorporateList(): Observable<any> {
        return this._apiRequestService.postData({}, apiRoutes.escrow.corporateList);
    }
    getDepositData(): Observable<any> {
        return this._apiRequestService.postData({}, apiRoutes.escrow.depositData);
    }

}