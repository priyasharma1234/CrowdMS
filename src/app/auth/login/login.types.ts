import { IUser } from '../../types/global';


export type ILoginApiPayload = {
  email: string;
  password: string;
}

export type ILoginApiResponse = {
  "user": IUser,
  "token": string
}
