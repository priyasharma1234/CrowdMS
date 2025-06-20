import { Injectable } from '@angular/core';
import { PagesService } from '@page/pages.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BankListService {

  bankList: BehaviorSubject<any> = new BehaviorSubject('');
  bankListForFund: BehaviorSubject<any> = new BehaviorSubject('');
  constructor(private pageService: PagesService) { }

  getBankList() {
    // this.loader.hide();
    const formData = new FormData();
    return new Promise((resolve, reject) => {
      this.pageService.getBankList(formData).subscribe((resp: any) => {
        this.bankList.next(resp.data);
        resolve(true)
      })
    });
  }

  getBankListForFund() {
    const formData = new FormData();
    return new Promise((resolve, reject) => {
      this.pageService.getBankListForFund(formData).subscribe((resp:any)=>{
        this.bankListForFund.next(resp.data);
        resolve(true)
      })
    });
  }
}
