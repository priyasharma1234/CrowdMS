import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { forkJoin } from 'rxjs';
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


    //   ● POST Average Dwell Time: https://hiring-dev.internal.kloudspot.com/api/analytics/dwell
    // ● POST Today’s Footfall: https://hiring-dev.internal.kloudspot.com/api/analytics/footfall
    ngOnInit(): void {
        this.fetchDwellTime();
        this.fetchFootfall();
        this.fetchOccupancy();
        this.fetchDemographics();

    }
    fetchAnalyticsData() {
        const payload = {
            siteId: 'SITE-AE-DXB-001',
            fromUtc: 2,
            toUtc: 7,
            avgDwellMinutes: 0,
            dwellRecords: 0
        };

        forkJoin([
            // Existing APIs
            this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsDwell),
            this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsFootfall),

            // New APIs
            this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsOccupancy),
            this._ApiRequestService.postData<any, any>({ payload }, apiRoutes.analyticsDemographics)
        ]).subscribe({
            next: ([dwellRes, footfallRes, occupancyRes, demographicsRes]) => {
                this.dwellDetails = dwellRes;
                this.footfallDetails = footfallRes;
                this.occupancyDetails = occupancyRes;
                this.demographicsRes = demographicsRes;
                console.log('Average Dwell Time:', dwellRes);
                console.log('Today’s Footfall:', footfallRes);
                console.log('Overall Occupancy Timeseries:', occupancyRes);
                console.log('Demographics Data:', demographicsRes);

                // You can now set your chart data here
                // e.g., this.occupancyChartData = occupancyRes.data;
                // e.g., this.demographicsChartData = demographicsRes.data;
            },
            error: (err) => {
                console.error('Analytics API error:', err);
            }
        });
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
                next: (res:any) => {
                    this.occupancyDetails = res;
                    console.log("res1111",res)
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
                next: (res) => {
                    this.demographicsRes = res;
                    console.log('Demographics Data:', res);
                    // this.demographicsChartData = res?.data;
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
      b.local?.split(' ')[1]?.slice(0, 5) // HH:mm
    ),
    datasets: [
      {
        label: 'Occupancy',
        data: buckets.map(b => b.avg ?? 0),

        // 👇 Figma-style smooth line
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


}