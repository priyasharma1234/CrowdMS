import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.post(
      'https://hiring-dev.internal.kloudspot.com/api/analytics/summary',
      {}
    );
  }

  getOccupancyTimeline() {
    return this.http.post(
      'https://hiring-dev.internal.kloudspot.com/api/analytics/occupancy',
      {}
    );
  }
}
