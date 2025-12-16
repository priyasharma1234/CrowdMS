import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
@Component({
    selector: 'app-dashboard-list',
    imports: [NgChartsModule],
    standalone: true,
    templateUrl: './dashboard-list.component.html',
    styleUrl: './dashboard-list.component.scss'
})
export class DashboardListComponent implements OnInit {
    malePercent = 0;
    femalePercent = 0;
    dwellDetails: any;
    footfallDetails: any;
    occupancyDetails: any;
    demographicsRes: any;
    constructor(private _ApiRequestService: ApiRequestService) {

    }
    occupancyChartData: ChartData<'line'> = {
        labels: [],
        datasets: []
    };

    occupancyChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                grid: {
                    color: '#eef2f7'
                },
                title: {
                    display: true,
                    text: 'Count'
                }
            }
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

    demographicsLineOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Time' }
            },
            y: {
                grid: { color: '#eef2f7' },
                title: { display: true, text: 'Count' }
            }
        }
    };

    ngOnInit(): void {
        this.fetchDwellTime();
        this.fetchFootfall();
        this.fetchOccupancy();
        this.fetchDemographics();

    }
    private getAnalyticsPayload() {
        return {
            siteId: "b0fa4e2a-2159-42e7-b97b-2a9d481158f6",
            toUtc: "1765378799999",
            fromUtc: "1765292400000"
        }
    }
    fetchDwellTime() {
        const payload = this.getAnalyticsPayload();

        this._ApiRequestService
            .postData<any, any>({ payload }, apiRoutes.analyticsDwell)
            .subscribe({
                next: (res) => {
                    this.dwellDetails = res;
                    console.log('Average Dwell Time:', res);
                },
                error: (err) => console.error('Dwell API error:', err)
            });
    }

    fetchFootfall() {
        const payload = this.getAnalyticsPayload();

        this._ApiRequestService
            .postData<any, any>({ payload }, apiRoutes.analyticsFootfall)
            .subscribe({
                next: (res) => {
                    this.footfallDetails = res;
                    console.log('Today’s Footfall:', res);
                },
                error: (err) => console.error('Footfall API error:', err)
            });
    }
    fetchOccupancy() {
        const payload = this.getAnalyticsPayload();

        this._ApiRequestService
            .postData<any, any>({ payload }, apiRoutes.analyticsOccupancy)
            .subscribe({
                next: (res: any) => {
                    this.occupancyDetails = res;
                    console.log("res1111", res)
                    this.updateOccupancyChart(res?.buckets || [])
                    console.log('Occupancy Timeseries:', res);
                    // this.occupancyChartData = res?.data;
                },
                error: (err) => console.error('Occupancy API error:', err)
            });
    }
    fetchDemographics() {
        const payload = this.getAnalyticsPayload();

        this._ApiRequestService
            .postData<any, any>({ payload }, apiRoutes.analyticsDemographics)
            .subscribe({
                next: (res: any) => {
                    this.demographicsRes = res;
                    console.log("demographicsssssssssss", res)
                    this.updateDemographicsCharts(res?.buckets || []);
                },
                error: (err) => console.error('Demographics API error:', err)
            });
    }
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

        let maleCount = 0;
        let femaleCount = 0;

        buckets.forEach(item => {
            if (item.male) {
                maleCount += item.male || 0;
            }
            if (item.female) {
                femaleCount += item.female || 0;
            }
        });

        const total = maleCount + femaleCount || 1;

        this.malePercent = Math.round((maleCount / total) * 100);
        this.femalePercent = Math.round((femaleCount / total) * 100);

        this.demographicsDonutData = {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    data: [this.malePercent, this.femalePercent],
                    backgroundColor: ['#4F9DA6', '#B7E0E3'],
                    borderWidth: 0
                }
            ]
        };
    }



}