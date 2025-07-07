import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-certificate',
  imports: [NgForOf],
  templateUrl: './view-certificate.component.html',
  styleUrl: './view-certificate.component.scss'
})
export class ViewCertificateComponent {
  activeTab: string = 'Escrow Certificate';

  tabs = [
    'Escrow Certificate',
    'Client Certificates',
    'Escrow Agent Certificates'
  ];

  selectTab(tab: string): void {
    this.activeTab = tab;
  }
}