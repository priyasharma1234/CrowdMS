import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  private m_isLoading = new BehaviorSubject<boolean>(false);
  isLoading = this.m_isLoading.asObservable();

  show() {
    this.m_isLoading.next(true);
  }

  hide() {
    this.m_isLoading.next(false);
  }
   setLoading(isLoading: boolean) {
    this.m_isLoading.next(isLoading);
  }
}
