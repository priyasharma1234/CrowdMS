import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EscrowService } from '../../../services/escrow.service';

@Component({
  selector: 'app-select-service',
  imports: [CommonModule, RouterModule],
  templateUrl: './select-service.component.html',
  styleUrl: './select-service.component.scss'
})
export class SelectServiceComponent implements OnInit {
  services = [
    {
      key: 'Software',
      name: 'Software/SaaS Escrow',
      description: 'A third party securely holds software source code to ensure the client can access it if the developer can\'t support the software anymore.',
      icon: 'assets/img/software.png'
    },
    {
      key: 'Physical',
      name: 'Physical Escrow',
      description: 'A neutral party holds physical items and releases them only when all agreed conditions between the parties are fulfilled.',
      icon: 'assets/img/physical.png'
    }
  ];
  selectedService: string | null = null;
  private _EscrowService = inject(EscrowService);
  constructor(private router: Router) {

  }
  ngOnInit(): void {

  }

  selectService(key: string) {
    this._EscrowService.setService(key);
    this.router.navigate(['/dashboard/add-escrow']);
  }


}
