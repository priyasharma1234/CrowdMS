import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT, NgClass, NgForOf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Side_Bar } from 'src/app/core/common/common-config';
import { Subject } from 'rxjs';
import { AuthCoreService } from 'src/app/services/auth-core.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/services/common.service';
import { SidebarService } from './sidebar-service.service';
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';

@Component({
    selector: 'app-sidebar',
    imports: [
        NgForOf,
        NgClass,
        SafeHtmlPipe
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    standalone: true
})
export class SidebarComponent {
  sidebarList: any = [...Side_Bar];
    selectedItem: any = 0;
    selectedBottom: any;
    isShown: boolean = false
    title: string;
    cachedIndex: string | null = null;
    pageTitle: any;
    subPageTitle: any;
    private m_destroy$ = new Subject<void>();
    public set _title(v: string) {
        this.title = v;
    }

    public get _title(): string {
        return this.title;
    }

    titleName: any;

    public set _titleName(v: string) {
        this.titleName = v;
    }

    public get _titleName(): string {
        return this.titleName;
    }

    payoutSideBar: any = null;
    version: string = ''

    public set _payoutSideBar(v: any) {
        this.payoutSideBar = v;
        console.log("_payoutSideBar", this.payoutSideBar)
    }

    public get _payoutSideBar(): any {
        return this.payoutSideBar;
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _AuthCoreService: AuthCoreService,
        private _Router: Router,
        private _SessionStorageService: SessionStorageService,
        private _DomSanitizer: DomSanitizer,
        private _CommonService: CommonService,
        private _SidebarService: SidebarService
    ) {
        this._SidebarService.sideBarList.subscribe((res: any) => {
            if (res) {
                this.sidebarList = res;
                console.log("sideBarList", this.sidebarList)
            }
        })



        this._CommonService.pageTitle.subscribe((e: any) => {
            this._titleName = e;
        })


        this._CommonService.subMenu.subscribe((e: any) => {
            if (e) {
                this._payoutSideBar = e;
                console.log("_payoutSideBarsubMEnuuuuuu", this._payoutSideBar)
            } else {
                this._payoutSideBar = null;
            }
        })
    }


    async ngOnInit() {
        this._SidebarService.selectedItemActive$.subscribe((res: string) => {
            this.selectedItem = res;
        });
        this._SidebarService.refreshSidebar();
        const selectItem = this._SessionStorageService.getItem('selectd_item') ? JSON.parse(this._SessionStorageService.getItem('selectd_item')) : '';
        this.selectedBottom = selectItem;

    }

    onHelp() {
        this._Router.navigate(['./help'])
    }

    transform(html: any) {
        return this._DomSanitizer.bypassSecurityTrustHtml(html);
    }
    ngAfterViewInit() {

    }

    onSideBar(item?: any, index?: any) {
        console.log("item", item)
        this.selectedBottom = '';
        if (item?.subMenu && item?.subMenu.length > 0) {
            if (this._CommonService.subMenu.getValue() !== item?.subMenu) {
                this.cachedIndex = item.name;
                this._CommonService.subMenu.next(item?.subMenu);
            }
            else {
                this.cachedIndex = null;
                this._CommonService.subMenu.next(null);
            }
        }
        else if (item?.routeUrl) {
            this._CommonService.subMenu.next(null);
            this.cachedIndex = null;
            this._Router.navigate([`${item.routeUrl}`]);
            this._SessionStorageService.setItem('selectd_item', item.name);
            this._SessionStorageService.setItem('pageTitle', item.name);
            this._CommonService.pageTitle.next(item.name)
            this.selectedItem = item.name;
        }
    };
    @HostListener('document:click', ['$event'])
    OnClickOutside(event: Event) {
        const sidebarElement = document.querySelector('.sidebar');
        const isClickInsideSidebar = sidebarElement?.contains(event.target as Node);
        if (!isClickInsideSidebar) {
            this._CommonService.subMenu.next(null);
        }
    }



    bottomsidebar(selected: any) {
        this.selectedBottom = selected;
        this.selectedItem = '';
        this._SessionStorageService.setItem('selectd_item', selected);
    }

    logOut() {
        this._AuthCoreService.logout(false, 'You have been logged out successfully');
    }
    ngOnDestroy(): void {
        this._SessionStorageService.removeItem('selectd_item');
        this._SessionStorageService.removeItem('pageTitle');
    }

    debug(item: any) {
        return item.value;
    }

    ResetSubMenu(item: any) {
        this._SessionStorageService.setItem('selectd_item', this.cachedIndex);
        this._SessionStorageService.setItem('pageTitle', item.value);
        this._CommonService.pageTitle.next(item.value)
        this.selectedItem = this.cachedIndex;
        this._CommonService.subMenu.next(null);
    }
    logout() {
        this._AuthCoreService.logout(false, 'You have been logged out successfully')
    }


    protected readonly sessionStorage = sessionStorage;
}




