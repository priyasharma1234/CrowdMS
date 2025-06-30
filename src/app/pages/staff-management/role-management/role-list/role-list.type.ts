import { IDynamicTableOptions } from "@core/common/dynamic-table/dynamic-table-types";
import { IGenericApiResponse, IHeaderNew } from "@core/types/types";
import { BehaviorSubject } from "rxjs";

export type IServiceRequestElement = {
    id: number
  corporate_id: number
  crew_ids: any
  custodian_id: any
  type: string
  order_type: string
  service_type: string
  pickup_date: string
  pickup_time_slot_id: number
  pickup_customer_name: string
  pickup_company_name: string
  pickup_customer_contact1: string
  pickup_customer_contact2: string
  pickup_address: string
  drop_customer_name: string
  drop_customer_contact1: string
  drop_customer_contact2: string
  drop_company_name: string
  drop_address: string
  service_mode: string
  insurance_by: string
  mode: string
  currency: string
  total_amount: string
  collectable_amount: string
  insurance_coverage: string
  pickup_customer_gst: string
  pickup_customer_pan: string
  drop_customer_gst: string
  drop_customer_pan: string
  customer_ref_id: string
  remarks: string
  status: number
  stage: number
  created_at: string
  item: Item
  tracking: Tracking[]
}
export interface Item {
  id: number
  name: string
  no_of_piece: number
  weight_type: string
  gross_weight: string
  net_weight: string
}

export interface Tracking {
  id: number
  service_request_id: number
  custodian_id: any
  type: string
  status: number
  hub_id: any
  remarks: any
  stage: string
}

export type IServiceRequestElementElementApiResponse = IGenericApiResponse<IServiceRequestElement[]> & {
  header: IHeaderNew
};



export type IServiceRequest = {
  list: IServiceRequestElement[],
  header: IHeaderNew,
  options: IDynamicTableOptions,
}

export type IServiceRequestBS = BehaviorSubject<IServiceRequest>;