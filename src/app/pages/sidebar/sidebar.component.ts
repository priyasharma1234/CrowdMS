import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT, NgClass, NgForOf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Side_Bar } from 'src/app/core/common/common-config';
import { Subject } from 'rxjs';
import { isArray } from 'lodash';
import { AuthCoreService } from 'src/app/services/auth-core.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/services/common.service';
import { SidebarService } from './sidebar-service.service';
import { PermissionServiceService } from 'src/app/core/services/permission-service.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf,
    RouterLink,
    NgClass,
    SharedModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true
})
export class SidebarComponent {
  // protected m_sideBarLinks: ISidebarItem[] = [
  //   {
  //     name: 'Dashboard',
  //     icon: 'assets/svg/sidebar/dashboard.svg',
  //     routerLink: '/dashboard',
  //     active: true
  //   },
  //   {
  //     name: 'Team Members',
  //     icon: 'assets/svg/sidebar/team-members.svg',
  //     routerLink: '/team-members',
  //     active: false
  //   },
  //   {
  //     name: 'Support',
  //     icon: 'assets/svg/sidebar/support.svg',
  //     routerLink: '/support',
  //     active: false
  //   },
  //   {
  //     name: 'Report',
  //     icon: 'assets/svg/sidebar/report.svg',
  //     routerLink: '/report',
  //     active: false
  //   }
  // ];
  sidebarList: any = [...Side_Bar];
  selectedItem: any = 0;
  selectedBottom: any;
  dashboardStatic = {
    icon: 'assets/svg/sidebar/dashboard.svg',
    id: 1,
    is_active: 1,
    name: "Dashboard",
    routeUrl: "dashboard"
  }
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
    // for (let i = 0; i < v?.length; i++) {
    //     if (isArray(v[i].permission)) {
    //         let hasPermission = false;
    //         for (let j = 0; j < v[i].permission.length; j++) {
    //             if (this._permissionService.hasPermission(v[i].permission[j])) {
    //                 hasPermission = true;
    //                 break;
    //             }
    //         }
    //         if (!hasPermission) {
    //             v.splice(i, 1);
    //             i--;
    //         }
    //         continue;
    //     }
    //     if (!this._permissionService.hasPermission(v[i].permission)) {
    //         v.splice(i, 1);
    //         i--;
    //     }
    // }
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
    private _SidebarService: SidebarService,
    public _permissionService: PermissionServiceService
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
    // console.log("JSON.parse(",JSON.parse(this._SessionStorageService.getItem('selectd_item')));
    const selectItem = this._SessionStorageService.getItem('selectd_item') || '';
    console.log('Selected item:', selectItem);
    this.selectedBottom = selectItem;
    const pageTitle = this._SessionStorageService.getItem('pageTitle') || '';
    this._CommonService.pageTitle.next(pageTitle)

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
    console.log("item",item)
    this.selectedBottom = '';
    if (item?.subMenu && item?.subMenu.length > 0) {
      if (this._CommonService.subMenu.getValue() !== item?.subMenu) {
        this.cachedIndex = item.name;
        console.log("item?.subMenu1111", item?.subMenu)
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



  clickProfile() {
    this.selectedItem = 50;
    this._Router.navigate(['profile']);
    this._SessionStorageService.setItem('selectd_item', this.selectedItem);
  };

  // showhide() {
  //     if (!this.isShown) {
  //         this.isShown = true;
  //         this.document.body.classList.add('sidebar-noneoverflow');
  //         this._AuthCoreService.toggleCols(true)
  //     } else {
  //         this.isShown = false;
  //         this.document.body.classList.remove('sidebar-noneoverflow');
  //         this._AuthCoreService.toggleCols(false)
  //     }
  // }

  bottomsidebar(selected: any) {
    this.selectedBottom = selected;
    this.selectedItem = '';
    this._SessionStorageService.setItem('selectd_item', selected);
  }

  logOut() {
    this._AuthCoreService.logout(false);
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
  onNavigateToServiceRequests() {
    this.selectedItem = 'Service Requests';
    sessionStorage.setItem('selectd_item', 'Service Requests');
    this._CommonService.pageTitle.next('Service Request List');
  }

  protected readonly sessionStorage = sessionStorage;
}




