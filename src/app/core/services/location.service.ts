import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

export interface LatLong {
  lat: number,
  long: number
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  seterLocation = new BehaviorSubject(null);
  geterLocation = this.seterLocation.asObservable();

  constructor() {
    this.setLocationFn();
    // console.log('asas');
  }

  async setLocationFn() {

    await this.getLocationService().then((resp) => {
      // console.log(resp);

      this.seterLocation.next(resp);
    });
  }

  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve({ long: resp.coords.longitude, lat: resp.coords.latitude });
      }, (r) => {
        // console.log(r);
        Swal.fire({
          icon:'error',
          title:'Location Error',
          text:'Please allow location...!!'
        })
      });
    });
  };

  async getLocationFn() {
    if (this.seterLocation.getValue()) {
      return this.seterLocation.getValue()
    } else {
      return this.seterLocation.getValue()
    }
  }

}
