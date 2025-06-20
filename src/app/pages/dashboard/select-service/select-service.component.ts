import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule, RouterModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent implements OnInit {
  services = [
    {
      key: 'software',
      name: 'Software/SaaS Escrow',
      description: 'A third party securely holds software source code to ensure the client can access it if the developer can\'t support the software anymore.',
      icon: 'assets/img/code-icon.svg'
    },
    {
      key: 'physical',
      name: 'Physical Escrow',
      description: 'A neutral party holds physical items and releases them only when all agreed conditions between the parties are fulfilled.',
      icon: 'assets/img/house-icon.svg'
    }
  ];
  selectedService: string | null = null;
  private _DashboardService = inject(DashboardService);
  constructor(private router: Router) {

  }
  ngOnInit(): void {

  }

  selectService(key: string) {
    this._DashboardService.setService(key);
    this.router.navigate(['/dashboard/add-escrow']);
  }


}
