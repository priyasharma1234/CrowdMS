// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class SocketService {

//   private socket!: Socket;
//   private connected = false;

//   connect() {
//     if (this.connected) return;


//     this.socket = io('http://localhost:4000');

//     this.connected = true;

//     this.socket.on('connect', () => {
//       console.log('✅ Socket connected:', this.socket.id);
//     });
//   }

//   onAlert(): Observable<any> {
//     return new Observable(observer => {
//       this.socket.on('alert', data => observer.next(data));
//     });
//   }

//   onLiveOccupancy(): Observable<any> {
//     return new Observable(observer => {
//       this.socket.on('live_occupancy', data => observer.next(data));
//     });
//   }

//   disconnect() {
//     if (this.socket && this.connected) {
//       this.socket.disconnect();
//       this.connected = false;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthCoreService } from './auth-core.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket!: Socket;
    private connected = false;

    constructor(private _AuthCoreService: AuthCoreService) {

    }
    connect() {
        if (this.connected) return;

        this.socket = io('https://hiring-dev.internal.kloudspot.com', {
            path: '/socket.io',
            transports: ['websocket'],
            auth: {
                token: this._AuthCoreService.token()
            }
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
            this.connected = true;
        });

        this.socket.on('connect_error', (err) => {
            console.warn('❌ Socket auth failed:', err.message);
        });
    }

    onAlert(): Observable<any> {
        return new Observable(observer => {
            if (!this.connected) this.connect();
            this.socket.on('alert', (data: any) => observer.next(data));
        });
    }
    onSim(): Observable<any> {
        return new Observable(observer => {
            const handler = (data: any) => observer.next(data);

            this.socket?.on('sim:event', handler);

            return () => {
                this.socket?.off('sim:event', handler);
            };
        });
    }

    onLiveOccupancy(): Observable<any> {
        return new Observable(observer => {
            if (!this.connected) this.connect();
            this.socket.on('live_occupancy', (data: any) => observer.next(data));
        });
    }

    disconnect() {
        if (this.socket && this.connected) {
            this.socket.disconnect();
            this.connected = false;
        }
    }
}
