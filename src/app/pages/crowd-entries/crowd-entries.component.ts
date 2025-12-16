import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';

@Component({
    selector: 'app-crowd-entries',
    imports: [CommonModule],
    templateUrl: './crowd-entries.component.html',
    styleUrl: './crowd-entries.component.scss'
})
export class CrowdEntriesComponent implements OnInit {
    entries: Array<any> = [];

    currentPage = 1;
    totalPages = 5;

    constructor(private _ApiRequestService: ApiRequestService) {

    }
    get totalPagesArray() {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }


    ngOnInit(): void {
        this.getEntries()

    }
    changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.getEntries();
    }
    getEntries() {

        const payload = {
               siteId: "b0fa4e2a-2159-42e7-b97b-2a9d481158f6",
    toUtc: "1765378799999",
    fromUtc: "1765292400000",
    pageNumber: this.currentPage,
    pageSize: 10
        };

        this._ApiRequestService
            .postData<any, any>(
                { payload },
                apiRoutes.analyticsEntryExit
            )
            .subscribe({
                next: (res: any) => {
                    if (res?.status) {

                        // Table data
                        this.entries = res?.records

                        // Pagination
                        this.totalPages = res?.data?.total_pages || 1;

                    } else {
                        this.entries = [];
                    }
                },
                error: (err: any) => {
                    console.error('Entry Exit API error:', err);
                    this.entries = [];
                }
            });
    }


}
