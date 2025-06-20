import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private selectedService$ = new BehaviorSubject<string | null>(null);

    setService(serviceKey: string) {
        this.selectedService$.next(serviceKey);
    }
    getService() {
        return this.selectedService$.asObservable();
    }
}