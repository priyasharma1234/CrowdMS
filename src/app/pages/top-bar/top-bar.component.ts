import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthCoreService } from 'src/app/services/auth-core.service';
import { SocketService } from 'src/app/services/socket.service';
declare global {
    interface Window {
        googleTranslateElementInit: any;
    }
}
@Component({
    selector: 'app-top-bar',
    imports: [RouterModule, CommonModule],
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
    titleName: any;
    private _CommonService = inject(CommonService)
    public set _titleName(v: string) {
        this.titleName = v;
    }

    public get _titleName(): string {
        return this.titleName;
    }
    simData: any;
    alerts: any[] = [];
    @ViewChild('alertDropdown') alertDropdown!: ElementRef;
    isDropdownOpen = false;
    siteName: any;
    simSub: Subscription;
    alertSub: Subscription;
    constructor(
        public _AuthCoreService: AuthCoreService,
        private socketService: SocketService
    ) {
        this._CommonService.pageTitle.subscribe((e: any) => {
            this._titleName = e;
        })
    }

    ngOnInit(): void {
        this.socketService.connect();
        this.simSub = this.socketService.onSim()
            .subscribe((data: any) => {
                console.log('SIM EVENT:1111111111111', data);
                this.siteName = data?.siteName
            });
        this.alertSub = this.socketService.onAlert()
            .subscribe((data: any) => {
                console.log('ALERT EVENT:', data);
                this.alerts.unshift(data);
                console.log("Alerts array:", this.alerts);
            });

    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (window.googleTranslateElementInit) {
                window.googleTranslateElementInit();
            }
        }, 1000);
    }
    logOut() {
        this._AuthCoreService.logout(false, 'You have been logged out successfully');
    }
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }
    
    ngOnDestroy() {
        this.alertSub?.unsubscribe();
        this.simSub?.unsubscribe();
    }

}
