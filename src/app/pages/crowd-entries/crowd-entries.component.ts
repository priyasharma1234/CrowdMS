import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { exhaustMap, finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-crowd-entries',
    imports: [CommonModule],
    templateUrl: './crowd-entries.component.html',
    styleUrl: './crowd-entries.component.scss'
})
export class CrowdEntriesComponent implements OnInit {
    entries: Array<any> = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;
    totalRecords = 0;
    maxVisiblePages = 3;
    siteId: string = ''
    private entriesRefresh$ = new Subject<void>();
    private destroy$ = new Subject<void>();
    isEntriesLoading = false;

    constructor(private _ApiRequestService: ApiRequestService,
        private socketService: SocketService
    ) {

    }

    get totalPagesArray() {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    simSub!: Subscription;

    ngOnInit(): void {
        this.socketService.connect();

        this.simSub = this.socketService.onSim()
            .subscribe((data: any) => {
                if (!data?.siteId) return;

                this.siteId = data.siteId;
                this.currentPage = 1;

                this.entriesRefresh$.next();
            });

        this.entriesRefresh$.next();

        this.handleEntriesRefresh();
    }
handleEntriesRefresh() {
  this.entriesRefresh$
    .pipe(
      exhaustMap(() => {
        this.isEntriesLoading = true;

        const payload = {
          siteId: this.siteId,
          fromUtc: "1765292400000",
          toUtc: "1765378799999",
          pageNumber: this.currentPage,
          pageSize: this.pageSize
        };

        return this._ApiRequestService
          .postData<any, any>({ payload }, apiRoutes.analyticsEntryExit)
          .pipe(
            finalize(() => this.isEntriesLoading = false)
          );
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res: any) => {
        this.entries = res?.records || [];
        this.totalRecords = res?.totalRecords || 0;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      },
      error: err => {
        console.error(err);
        this.entries = [];
      }
    });
}

    changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
      this.entriesRefresh$.next(); 
    }

    get pages(): number[] {
        const pages: number[] = [];

        let start = Math.max(1, this.currentPage - 1);
        let end = start + this.maxVisiblePages - 1;

        if (end > this.totalPages) {
            end = this.totalPages;
            start = Math.max(1, end - this.maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    get showDots(): boolean {
        return this.pages[this.pages.length - 1] < this.totalPages - 1;
    }

    // getEntries() {
    //     const payload = {
    //         siteId: this.siteId,
    //         fromUtc: "1765292400000",
    //         toUtc: "1765378799999",
    //         pageNumber: this.currentPage,
    //         pageSize: this.pageSize
    //     };

    //     this._ApiRequestService
    //         .postData<any, any>({ payload }, apiRoutes.analyticsEntryExit)
    //         .subscribe({
    //             next: (res: any) => {
    //                 if (res) {
    //                     this.entries = res.records || [];
    //                     this.totalRecords = res.totalRecords || 0;
    //                     this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //                 }
    //             },
    //             error: err => {
    //                 console.error(err);
    //                 this.entries = [];
    //             }
    //         });
    // }
  ngOnDestroy() {
  this.simSub?.unsubscribe();
  this.destroy$.next();
  this.destroy$.complete();
}
}