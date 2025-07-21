import { IGenericApiResponse } from "../../types/global"


export type IResetPasswordElementList = {
  email: string,
  token: string,
  type: string | null,
}

export type IResetPasswordElementListApiResponse = IGenericApiResponse<IResetPasswordElementList>

export type IUserList = {
  list: IResetPasswordElementList,
}
