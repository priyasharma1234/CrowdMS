import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, finalize, forkJoin, merge, Subject, Subscription, switchMap, takeUntil, tap, timeout } from 'rxjs';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { SocketService } from 'src/app/services/socket.service';
@Component({
    selector: 'app-dashboard-list',
    imports: [NgChartsModule, NgIf],
    standalone: true,
    templateUrl: './dashboard-list.component.html',
    styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
    malePercent = 0;
    femalePercent = 0;
    dwellDetails: any;
    footfallDetails: any;
    alertSub!: Subscription;
    occupancySub!: Subscription;
    simSub!: Subscription;
    liveOccupancyCount = 0;
    alerts: any[] = [];
    occupancy: any;
    demographicsLoading: false;

    constructor(private _ApiRequestService: ApiRequestService,
        private socketService: SocketService
    ) {

    }
    occupancyChartData: ChartData<'line'> = {
        labels: [],
        datasets: []
    };

    occupancyChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,

        elements: {
            line: {
                cubicInterpolationMode: 'monotone'
            }
        },

        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },

        scales: {
            x: { grid: { display: false }, title: { display: true, text: 'Time' } },
            y: { grid: { color: '#eef2f7' }, title: { display: true, text: 'Count' } }
        }
    };
    demographicsCenterTextPlugin = {
        id: 'centerText',
        beforeDraw(chart: any) {
            const { ctx, width, height } = chart;

            ctx.restore();
            ctx.textAlign = 'center';

            ctx.font = '500 12px Inter';
            ctx.fillStyle = '#6B7280';
            ctx.fillText('Total Crowd', width / 2, height / 2 - 6);

            ctx.font = '700 18px Inter';
            ctx.fillStyle = '#111827';
            ctx.fillText('100%', width / 2, height / 2 + 16);

            ctx.save();
        }
    };
    demographicsDonutData: ChartData<'doughnut'> = {
        labels: ['Male', 'Female'],
        datasets: []
    };

    demographicsDonutOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
            legend: { display: false }
        }
    };
    demographicsLineData: ChartData<'line'> = {
        labels: [],
        datasets: []
    };
    private refreshTrigger$ = new Subject<string>();
    demographicsLineOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',

                labels: {
                    usePointStyle: true,
                    padding: 16,

                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets || [];
                        return datasets.map((ds: any, i: number) => ({
                            text: ds.label,
                            fillStyle: ds.borderColor,
                            strokeStyle: ds.borderColor,
                            lineWidth: 0,
                            hidden: !chart.isDatasetVisible(i),
                            index: i
                        }));
                    }
                }
            }
        },

        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#eef2f7' } }
        }
    };
    currentSiteId: string | null = null;
    private dashboardRefresh$ = new Subject<void>();
    private destroy$ = new Subject<void>();
    isDashboardLoading = false;

    ngOnInit(): void {
        // this.occupancySub = this.socketService.onLiveOccupancy()
        //     .subscribe(data => {
        //         if (!data?.siteId) return;

        //         this.liveOccupancyCount = data.siteOccupancy ?? 0;
        //         if (this.currentSiteId !== data.siteId) {
        //             this.currentSiteId = data.siteId;
        //             this.dashboardRefresh$.next();
        //         }
        //     });
        this.occupancySub = this.socketService.onLiveOccupancy()
            .subscribe(data => {
                //   if (!data?.siteId) return;

                this.liveOccupancyCount = data.siteOccupancy ?? 0;

                //   if (this.currentSiteId !== data.siteId) {
                //     this.currentSiteId = data.siteId;
                //     this.dashboardRefresh$.next();
                //   }
            });

        // 🔵 SIM event handling
        this.simSub = this.socketService.onSim()
            .subscribe(sim => {
                if (!sim?.siteId) return;

                // site switch logic
                if (this.currentSiteId !== sim.siteId) {
                    this.currentSiteId = sim.siteId;
                    this.dashboardRefresh$.next();
                }

                // 🔔 SIM sirf dashboard refresh trigger kare
                this.dashboardRefresh$.next();

                console.log('SIM EVENT TRIGGERED:', sim);
            });


        this.handleDashboardRefresh();
        // this.occupancySub = this.socketService.onLiveOccupancy()
        //     .subscribe((data: any) => {
        //         console.log('LIVE OCCUPANCY EVENT:', data);
        //         this.liveOccupancyCount = data?.siteOccupancy || 0;
        //     });
        // this.fetchDwellTime();
        // this.fetchFootfall();
        // this.fetchOccupancy();
        // this.fetchDemographics();

    }
    handleDashboardRefresh() {
        this.dashboardRefresh$
            .pipe(
                filter(() => !this.isDashboardLoading),
                tap(() => this.isDashboardLoading = true),
                switchMap(() =>
                    merge(
                        this.fetchDwellTime().pipe(
                            tap(res => this.dwellDetails = res),
                            catchError(err => { console.error('Dwell failed', err); return EMPTY; })
                        ),
                        this.fetchFootfall().pipe(
                            tap(res => this.footfallDetails = res),
                            catchError(err => { console.error('Footfall failed', err); return EMPTY; })
                        ),
                        this.fetchOccupancy().pipe(
                            tap((res: any) => this.updateOccupancyChart(res?.buckets || [])),
                            catchError(err => { console.error('Occupancy failed', err); return EMPTY; })
                        ),
                        this.fetchDemographics().pipe(
                            tap((res: any) => this.updateDemographicsCharts(res?.buckets || [])),
                            catchError(err => { console.error('Demographics failed', err); return EMPTY; })
                        )
                    ).pipe(
                        finalize(() => this.isDashboardLoading = false)
                    )
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }


    private getAnalyticsPayload() {
        return {
            siteId: this.currentSiteId,
            toUtc: "1765378799999",
            fromUtc: "1765292400000"
        }
    }
    fetchDwellTime() {
        const payload = this.getAnalyticsPayload();
        return this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsDwell);
    }

    fetchFootfall() {
        const payload = this.getAnalyticsPayload();
        return this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsFootfall);
    }

    fetchOccupancy() {
        const payload = this.getAnalyticsPayload();
        return this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsOccupancy);
    }

    fetchDemographics() {
        const payload = this.getAnalyticsPayload();
        return this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsDemographics);
    }

    // fetchDwellTime() {
    //     const payload = this.getAnalyticsPayload();

    //     this._ApiRequestService
    //         .postData<any, any>({ payload }, apiRoutes.analyticsDwell)
    //         .subscribe({
    //             next: (res) => {
    //                 this.dwellDetails = res;
    //                 console.log('Average Dwell Time:', res);
    //             },
    //             error: (err) => console.error('Dwell API error:', err)
    //         });
    // }

    // fetchFootfall() {
    //     const payload = this.getAnalyticsPayload();

    //     this._ApiRequestService
    //         .postData<any, any>({ payload }, apiRoutes.analyticsFootfall)
    //         .subscribe({
    //             next: (res) => {
    //                 this.footfallDetails = res;
    //                 console.log('Today’s Footfall:', res);
    //             },
    //             error: (err) => console.error('Footfall API error:', err)
    //         });
    // }
    // fetchOccupancy() {
    //     const payload = this.getAnalyticsPayload();

    //     this._ApiRequestService
    //         .postData<any, any>({ payload }, apiRoutes.analyticsOccupancy)
    //         .subscribe({
    //             next: (res: any) => {
    //                 this.updateOccupancyChart(res?.buckets || [])
    //             },
    //             error: (err) => console.error('Occupancy API error:', err)
    //         });
    // }
    // fetchDemographics() {
    //     const payload = this.getAnalyticsPayload();

    //     this._ApiRequestService
    //         .postData<any, any>({ payload }, apiRoutes.analyticsDemographics)
    //         .subscribe({
    //             next: (res: any) => {
    //                 this.updateDemographicsCharts(res?.buckets || []);
    //             },
    //             error: (err) => console.error('Demographics API error:', err)
    //         });
    // }
    convertMinutesToHms(value: number | null | undefined): string {
        if (!value) return '0 hr 0 min 0 sec';

        const hours = Math.floor(value / 60);
        const minutes = Math.floor(value % 60);
        const seconds = Math.round((value % 1) * 60);

        return `${hours} hr ${minutes} min ${seconds} sec`;
    }
    updateOccupancyChart(buckets: any[]) {
        if (!buckets || !buckets.length) return;

        this.occupancyChartData = {
            labels: buckets.map(b =>
                b.local?.split(' ')[1]?.slice(0, 5)
            ),
            datasets: [
                {
                    label: 'Occupancy',
                    type: 'line',
                    data: buckets.map(b => b.avg ?? 0),
                    tension: 0.45,
                    fill: true,

                    borderWidth: 2,
                    borderColor: '#4F9DA6',
                    backgroundColor: 'rgba(79,157,166,0.12)',

                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        };
    }
    updateDemographicsCharts(buckets: any[]) {
        if (!buckets || !buckets.length) return;

        let maleTotal = 0;
        let femaleTotal = 0;

        const labels: string[] = [];
        const maleSeries: number[] = [];
        const femaleSeries: number[] = [];

        buckets.forEach(item => {
            const male = item.male || 0;
            const female = item.female || 0;

            maleTotal += male;
            femaleTotal += female;

            labels.push(
                item.local ? item.local.split(' ')[1].slice(0, 5) : ''
            );

            maleSeries.push(male);
            femaleSeries.push(female);
        });

        const total = maleTotal + femaleTotal || 1;

        this.malePercent = Math.round((maleTotal / total) * 100);
        this.femalePercent = Math.round((femaleTotal / total) * 100);

        this.demographicsDonutData = {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    type: 'doughnut',
                    data: [this.malePercent, this.femalePercent],
                    backgroundColor: ['#4F9DA6', '#B7E0E3'],
                    borderWidth: 0
                }
            ]
        };

        this.demographicsLineData = {
            labels,
            datasets: [
                {
                    label: 'Male',
                    type: 'line',
                    data: maleSeries,
                    borderColor: '#4F9DA6',
                    backgroundColor: 'rgba(79,157,166,0.15)',
                    tension: 0.45,
                    fill: true,
                    pointRadius: 0
                },
                {
                    label: 'Female',
                    type: 'line',
                    data: femaleSeries,
                    borderColor: '#B7E0E3',
                    backgroundColor: 'rgba(183,224,227,0.25)',
                    tension: 0.45,
                    fill: true,
                    pointRadius: 0
                }
            ]
        };
    }

    ngOnDestroy() {
        this.occupancySub?.unsubscribe();
        this.simSub?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }


}