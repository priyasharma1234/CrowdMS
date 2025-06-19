import {Component} from '@angular/core';
import {ISidebarItem} from './sidebar.types';
import {NgClass, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf,
    RouterLink,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true
})
export class SidebarComponent {
  protected m_sideBarLinks: ISidebarItem[] = [
    {
      name: 'Dashboard',
      icon: 'assets/svg/sidebar/dashboard.svg',
      routerLink: '/dashboard',
      active: true
    },
    {
      name: 'Team Members',
      icon: 'assets/svg/sidebar/team-members.svg',
      routerLink: '/team-members',
      active: false
    },
    {
      name: 'Support',
      icon: 'assets/svg/sidebar/support.svg',
      routerLink: '/support',
      active: false
    },
    {
      name: 'Report',
      icon: 'assets/svg/sidebar/report.svg',
      routerLink: '/report',
      active: false
    }
  ];
}
