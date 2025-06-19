// src/global.d.ts
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

type IApiRequestPayload<T> = {
  form?: string;
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

