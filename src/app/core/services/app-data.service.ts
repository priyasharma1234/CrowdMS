import { SessionStorageService } from '@core/services/session-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import * as _ from 'lodash'

@Injectable({
	providedIn: "root",
})
export class AppData {
	// setting base url in static variable  and we can change base url from here as per our api requirnment
	static corporateBaseUrl = environment.corporateBaseUrl;
	 _remitterLogin: BehaviorSubject<any> = new BehaviorSubject('');

	static allBanlancesSub: BehaviorSubject<any> =  new BehaviorSubject({aepswallet: '', balance: '',
	railwaywallet: '',bbpswallet: '', dmtwallet: '',minbalance: ''});
	static allBanlances;

	static latLang: BehaviorSubject<any> = new BehaviorSubject({lat: '', lang: ''});
	static latLangSub: any = {lat: '', lang: ''};

	static remiiterLimit: BehaviorSubject<any> = new BehaviorSubject(null);
	static refundOtp: BehaviorSubject<any> = new BehaviorSubject(null);
	constructor(private sessionStorage: SessionStorageService) {
		// console.log("ncjdhdfiwe")
		// let data = this.sessionStorage.getItem('allBalances');
		// if (data) {

		// 	AppData.allBanlancesSub.next(this.sessionStorage.getItem('allBalances'));
		// } else{
		// 	AppData.allBanlancesSub.subscribe((res) => {
		// 		if(res){
		// 			this.sessionStorage.setItem('allBalances', res);
		// 			AppData.allBanlances = res;
		// 		}

		// 	});
		// }

	}



}
