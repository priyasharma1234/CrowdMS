import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private m_isLoading = new BehaviorSubject<boolean>(false);
  isLoading = this.m_isLoading.asObservable();
}
