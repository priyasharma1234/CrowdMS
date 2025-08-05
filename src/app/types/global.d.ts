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

export type IUser = {
  id: number,
  corporate_id: number,
  name: string,
  username: string,
  status: "Active" | "Inactive",
  email: string,
  phone: number | string | null,
  email_verified_at: string | null,
  maintenance_mode: number,
  created_at: string,
  updated_at: string,
  permissions: string[],
  role: string
}
export type   IHeader = {
  canEdit: 'always' | 'onedit' | 'never',
    is_show: boolean | 0 | 1,
    isalways:boolean | 0 | 1,
    isedit: boolean | 0 | 1,
    isorder: boolean | 0 | 1,
    issearch: boolean | 0 | 1,
    issort: boolean | 0 | 1,
    name: string,
    options: any, //change this
    permission:any
    row: number,
    type: 'text' | 'inrSh' | 'inr' | 'textarea' | 'number' | 'select' | 'date' | 'time' | 'datetime' | 'checkbox' | 'radio' | 'file' | 'image' | 'color' | 'password' | 'email' | 'tel' | 'url' | 'range' | 'search' | 'month' | 'week' | 'hidden' | 'button' | 'submit' | 'reset',
    value: string,
    values: any,
    edit: boolean
}

