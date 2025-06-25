import { Injectable } from '@angular/core';
import {IDynamicTableConfig, IDynamicTableOptions, IDynamicTablePaginationConfig} from './dynamic-table-types';

@Injectable({
  providedIn: 'root'
})
export class DynamicTableService {

  constructor() { }


  dtUpdateByPagination(val: any, dynamicTableOptions: IDynamicTableOptions | undefined) {
    if(!dynamicTableOptions) return;
    if (val == 'back') {
      dynamicTableOptions.pagination!.currentPage = dynamicTableOptions.pagination!.currentPage - 1;
    } else if (val == 'next') {
      dynamicTableOptions.pagination!.currentPage = dynamicTableOptions.pagination!.currentPage + 1;
    } else if (val == 'first') {
      dynamicTableOptions.pagination!.currentPage = 1;
    } else if (val == 'last') {
      dynamicTableOptions.pagination!.currentPage = dynamicTableOptions.pagination!.totalPages;
    } else if (typeof val == 'number') {
      dynamicTableOptions.pagination!.currentPage = val;
    }
    dynamicTableOptions.pagination!.itemLengthStartFrom = (dynamicTableOptions.pagination!.currentPage - 1) * dynamicTableOptions.pagination!.itemsPerPage

    if (dynamicTableOptions.dtUpdateFnCallBack &&
        typeof dynamicTableOptions.dtUpdateFnCallBack == 'function') {
      dynamicTableOptions.dtUpdateFnCallBack();
    }
  }

  setLocalData(tableOptions: IDynamicTablePaginationConfig, obj:any) {
    let totalRecords = +(obj?.pagination?.total ?? tableOptions.totalItems);
    +totalRecords;
    tableOptions.totalItems = totalRecords;
    tableOptions.itemsPerPage = +tableOptions.itemsPerPage;
    tableOptions.totalPages = Math.ceil(tableOptions.totalItems / tableOptions.itemsPerPage);
    tableOptions.totalPages = tableOptions.totalPages ?? 0;
    let val = [...(obj as any[])];
    const startIndex = (tableOptions.currentPage - 1) * tableOptions.itemsPerPage;
    const endIndex = startIndex + tableOptions.itemsPerPage;
    tableOptions.records = val.slice(startIndex, endIndex);
  }

  TableRefresh(tableOptions: IDynamicTableOptions, obj?: any) {
    let totalRecords = +(obj?.pagination?.total ?? tableOptions.pagination!.totalItems!);
    +totalRecords;
    tableOptions.pagination!.totalItems! = totalRecords;
    if (tableOptions?.pagination!.itemsPerPage == 'All') {
      tableOptions.toRec = totalRecords;
      tableOptions.pagination!.currentPage = 1;
      tableOptions.fromRec = 1;
      tableOptions.pagination!.totalPages = null;
    }else{
    tableOptions.pagination!.itemsPerPage! = +tableOptions.pagination!.itemsPerPage!;
    tableOptions.pagination!.totalPages! = Math.ceil(tableOptions.pagination!.totalItems! / tableOptions.pagination!.itemsPerPage!);
    tableOptions.pagination!.totalPages! = tableOptions.pagination!.totalPages! ?? 0;

    tableOptions.fromRec = totalRecords? tableOptions.pagination!.itemLengthStartFrom + 1 : 0;
    tableOptions.toRec = tableOptions.pagination!.currentPage * tableOptions.pagination!.itemsPerPage;

    tableOptions.toRec = tableOptions.toRec > tableOptions.pagination!.totalItems ? tableOptions.pagination!.totalItems: tableOptions.toRec;
  }
  }

  dtUpdateByPageLength(item: any, dynamicTableOptions: IDynamicTableOptions) {
    dynamicTableOptions.pagination!.itemsPerPage = item.target.value;
    dynamicTableOptions.pagination!.itemLengthStartFrom = 0;
    dynamicTableOptions.pagination!.currentPage = 1;
    if (dynamicTableOptions.dtUpdateFnCallBack && typeof dynamicTableOptions.dtUpdateFnCallBack == 'function') {
      dynamicTableOptions.dtUpdateFnCallBack();
    }
  }

  GetSearchArray(header:any, type: 'order' | 'search') {
    let ret = header?.map((r: any) => {
      if (type === 'order' ? r.isorder : r.issearch) {
        let obj: any = {name: r.name, value: r.value};
        if (r.values) obj.values = r.values;
        return obj;
      }
      return;
    });
    ret = ret.filter((r:any) => r);
    return ret;
  }

    dtSortHeaderClick(item: any, diTableOptions: IDynamicTableConfig<unknown>) {
      if (diTableOptions.options!.sortBy === item.name) {
        diTableOptions.options!.sortDirection =
          diTableOptions.options!.sortDirection === 'asc' ? 'desc' : 'asc';
      }
      diTableOptions.options!.sortBy = item.name;
      var column: any = diTableOptions.header.filter(
        (column: any) => column.name === diTableOptions.options!.sortBy
      )[0];
      var isNumeric: boolean = column.isnumeric ? true : false;
      if (
        diTableOptions.options!.dtUpdateFnCallBack &&
        typeof diTableOptions.options!.dtUpdateFnCallBack == 'function'
      ) {
        diTableOptions.options!.dtUpdateFnCallBack();
      }
    }

    dtIsSort(item: any, dtTableOptions: IDynamicTableOptions) {
      return (
        (item.issort || item.issort == undefined) &&
        dtTableOptions.sortBy !== item.name &&
        item.name !== ''
      );
    }

    dtIsSortAsc(item: any, diTableOptions: IDynamicTableOptions) {
      var isSortAsc: boolean =
        (item.issort || item.issort == undefined) &&
        diTableOptions.sortBy === item.name &&
        diTableOptions.sortDirection === 'asc';
      return isSortAsc;
    }

    dtIsSortDesc(item: any, diTableOptions: IDynamicTableOptions) {
      var isSortDesc: boolean =
        (item.issort || item.issort == undefined) &&
        diTableOptions.sortBy === item.name &&
        diTableOptions.sortDirection === 'desc';
      return isSortDesc;
    }
}
