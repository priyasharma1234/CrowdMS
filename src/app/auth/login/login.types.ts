import { IUser } from '../../types/global';


export type ILoginApiPayload = {
  username: string;
  password: string;
  longitude: number;
  latitude: number
}

export type ILoginApiResponse = {
  "user": IUser,
  "token": string
}
