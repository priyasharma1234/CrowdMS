import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiRequestService } from './api-request.service';
import { apiRoutes } from '../config/api-request';

@Injectable({
    providedIn: 'root',
})
export class EscrowService {
    private selectedService$ = new BehaviorSubject<string | null>(localStorage.getItem('selected_service'));
    private selectedEscrowID$ = new BehaviorSubject<string | null>(null);
    private selectedDepositorID$ = new BehaviorSubject<string | null>(null);
    private selectedbeneID$ = new BehaviorSubject<string | null>(null);

    private _apiRequestService = inject(ApiRequestService);
    setService(serviceKey: string): void {
        localStorage.setItem('selected_service', serviceKey);
        this.selectedService$.next(serviceKey);
    }

    getService(): Observable<string | null> {
        const localValue = localStorage.getItem('selected_service');
        if (!this.selectedService$.value && localValue) {
            this.selectedService$.next(localValue);
        }

        return this.selectedService$.asObservable();
    }

    clearService(): void {
        localStorage.removeItem('selected_service');
        this.selectedService$.next(null);
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
        return this._apiRequestService.getData(apiRoutes.escrow.depositData);
    }
    getEscorwList(): Observable<any> {
        return this._apiRequestService.postData({}, apiRoutes.escrow.getEscrowList);
    }
    getReleaseConditionsList(params: any): Observable<any> {
        return this._apiRequestService.postData(params, apiRoutes.release.getConditionList);
    }

}