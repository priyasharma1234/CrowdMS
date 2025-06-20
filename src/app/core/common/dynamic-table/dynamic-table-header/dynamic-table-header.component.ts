import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Swal from "sweetalert2";
import {CustConfg} from "@core/interfaces/ngx-datePicker-custConfig";
import {ApiRequestService} from "@core/services/api-request.service";
import {DynamicTableService} from "@core/common/dynamic-table/dynamic-table.service";
import {FileTypes} from "@core/types/types";
import * as XLSX from "xlsx";
import {IDynamicTableConfig, IDynamicTableOptions} from "@core/common/dynamic-table/dynamic-table-types";

@Component({
  selector: 'app-dynamic-table-header',
  templateUrl: './dynamic-table-header.component.html',
  styleUrls: ['./dynamic-table-header.component.scss']
})
export class DynamicTableHeaderComponent implements OnInit {

  @Input() tableOptions!: IDynamicTableConfig<unknown>;
  @Input() rotateIt: boolean = false;
  @Output() reloadTbl = new EventEmitter<void>();
  @Input() isReportCanDownload: boolean = false;
  @Output() downloadReport = new EventEmitter<void>();

  downloadFileType = [
    { name: "XLSX", value: ".xlsx" },
    { name: "CSV", value: ".csv" },
    { name: "XLS", value: ".xls" },
  ];
  checked: boolean;

  bsCustConfg = CustConfg;

  tableRecords: any;

  constructor(
      private _ApiRequestService:ApiRequestService,
      public _DynamicTableService: DynamicTableService
  ) {}

  ngOnInit(): void {}

  async download(type: any) {
    if (this.tableOptions.options?.downloadReports?.downloadFunc) {
      this.tableOptions.options.downloadReports.downloadFunc();
      return;
    }

    let formdata: FormData = this.tableOptions.options?.downloadReports?.formData();

    if (formdata.get('start'))
      formdata.delete('start');
    if (formdata.get('length'))
      formdata.delete('length');
    // this._ApiRequestService.postDataReportingAsync(formdata, this.tableOptions.options?.downloadReports?.url).subscribe((res: any) => {
    let res: any = await this._ApiRequestService.postDataReportingAsync(formdata, this.tableOptions.options?.downloadReports?.url);
    if (res.statuscode == 200) {
      let mainData: any = [];
      (res.data as []).forEach((e) => {
        let obj: any = {};
        (res.header as []).forEach((l: any) => {
          if (l.isShow) {
            if (l.name.includes('.')) {
              let split = l.name.split('.')
              obj[l.value] = e[split[0]][split[1]];
            } else {
              obj[l.value] = e[l.name];
            }

            if (l.values) {
              if (l.name.includes('.')) {
                let split = l.name.split('.')
                obj[l.value] = l.values[e[split[0]][split[1]]];
              }
              else {
                obj[l.value] = l.values[e[l.name]];
              }
            }
          }
        });
        mainData.push(obj);
      });

      this.downloadFile(
        type,
        this.tableOptions.options?.downloadReports?.fileName ?? "report",
        mainData
      );
    } else {
      Swal.fire({
        icon: "error",
        title: res.message,
      });
    }
    // });
  }

  private downloadFile(type: FileTypes, name: string, data:any) {
    const fileName = name + "." + type;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, fileName);
  }

}
