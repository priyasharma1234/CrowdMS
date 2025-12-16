import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Side_Bar } from 'src/app/core/common/common-config';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  selectedItem: BehaviorSubject<number> = new BehaviorSubject(0);
  sideBarList: BehaviorSubject<any> = new BehaviorSubject(null);
  private m_selectedItemActive: BehaviorSubject<string> = new BehaviorSubject("");

  get selectedItemActive$() {
    return this.m_selectedItemActive.asObservable();
  }
  get selectedItemActive() {
    return this.m_selectedItemActive.value;
  }
  set selectedItemActive(value: string) {
    this.m_selectedItemActive.next(value);
  }

  constructor(
  ) {}


  refreshSidebar() {
    let sideBar = structuredClone(Side_Bar);
    console.log("Filtered SideBar:", sideBar);
    this.sideBarList.next(sideBar);
  }

}
