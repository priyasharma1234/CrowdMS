import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	constructor() { }
 
    // saving or storing items to the local storage
	setItem(key: string, item: any) {
		localStorage.setItem(key, JSON.stringify(item));
	}

    // getting item from local storage
	getItem(key: string) {
		return localStorage.getItem(key);
	}

    // clearing everything from local storage
	clearStorage() {
		localStorage.clear();
	}

    // removing an item from local storage
	removeItem(key: string) {
		localStorage.removeItem(key);
	}

}