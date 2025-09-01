import {Injectable} from '@angular/core';
import { SessionStorageService } from './session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor(private sessionStorage: SessionStorageService) {
    }

    has(key: string) {
        const data = this.sessionStorage.getItem(key);
        return (data ? true : false);
    }

    set(key: string, value: any) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
            this.sessionStorage.setItem(key, value);
        }

    }

    get(key: string) {
        const data = this.sessionStorage.getItem(key);
        if (data) {
            if (this.isJsonString(data)) {
                return JSON.parse(data);
            }

            // console.log(data)
            return data;
            // console.log(data)
        }
        return false;
    }

    remove(key: string) {
        this.sessionStorage.removeItem(key);
    }


    clearSessionStorage() {
        this.sessionStorage.clearStorage()
    }

    isJsonString(str: string) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}
