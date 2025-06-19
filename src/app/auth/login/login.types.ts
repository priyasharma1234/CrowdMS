import {IUser} from '../../types/global';


export type ILoginApiPayload = {
  username: string;
  password: string;
}

export type ILoginApiResponse = {
  "user": IUser,
  "token": string
}
