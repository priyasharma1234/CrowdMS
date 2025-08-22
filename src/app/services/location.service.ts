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
  }

  async setLocationFn() {
    try {
      const resp = await this.getLocationService();
      this.seterLocation.next(resp);
    } catch (err) {
      this.handleLocationError(err);
    }
  }

  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported by browser.');
      }
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve({ long: resp.coords.longitude, lat: resp.coords.latitude });
      }, (error) => {
        // console.log(r);
        reject('Please allow location access!');
      });
    });
  };

  private handleLocationError(error: any) {
    let message = 'Please allow location access!';
    if (error?.message) {
      message = error.message;
    }
    Swal.fire({
      icon: 'error',
      title: 'Location Error',
      text: message,
    });
  }

  async getLocationFn(): Promise<LatLong | null> {
    const value = this.seterLocation.getValue();
    if (value) return value;

    try {
      const newLocation = await this.getLocationService();
      this.seterLocation.next(newLocation);
      return newLocation;
    } catch (err) {
      this.handleLocationError(err);
      return null;
    }
  }

}
