// src/global.d.ts
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

type IApiRequestPayload<T> = {
  // form?: string;
  form?: FormGroup<any>
  payload?: T;
  id?: any;
}

export type IGenericApiResponse<T> = {
  statuscode: 200,
  responsecode: number,
  message: string,
  data: T,
  [key: string]: any
} | {
  statuscode: 203 | 422 | 500,
  responsecode: number,
  message: string,
  [key: string]: any
}
