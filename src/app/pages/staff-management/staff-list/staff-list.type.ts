import { IDynamicTableOptions } from "@core/common/dynamic-table/dynamic-table-types";
import { IGenericApiResponse, IHeaderNew } from "@core/types/types";
import { BehaviorSubject } from "rxjs";
export type IStaffElement = {
  id: number
  corporate_id: number
  name: string
  username: string
  email: string
  phone: string
  status: number
  created_at: string
}

export type IStaffElementElementApiResponse = IGenericApiResponse<IStaffElement[]> & {
  header: IHeaderNew
};



export type IStaff = {
  list: IStaffElement[],
  header: IHeaderNew,
  options: IDynamicTableOptions,
}

export type IStaffBS = BehaviorSubject<IStaff>;