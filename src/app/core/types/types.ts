import {IDynamicTableColumnConfig} from "@core/common/dynamic-table/dynamic-table-types";

export type FileTypes = 'xls' | 'csv' | 'xlsx';

export type User = {

}

export type IGenericApiResponse<T> = {

    'statuscode': string,
    'status': string,
    'responsecode': string,
    'message': string,
    data: T,
    error?: T,
    [key: string]: any
}


export type IHeaderNew = IDynamicTableColumnConfig[];

export type SerarchElement = {
  values: string,
  value: string,
  name: string,
}
export type SearchFilter = {
  filters: SerarchElement[]
}
