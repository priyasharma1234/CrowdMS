import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable()
export class ExcelToJsonService {
  processedJsonData: any;

  constructor() { }

  getJsonFromExcelFn(ev: any) {
    return new Promise((resolve, reject) => {
      if (!ev) {
        reject(Error("It broke"));
      }
      this.processedJsonData = null;
      let workBook: any = null;
      let jsonData = null;
      const reader = new FileReader();
      // const file = ev.target.files[0];
      const file = ev;
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(jsonData);
        this.processedJsonData = dataString;
        resolve(this.processedJsonData);
      };
      reader.readAsBinaryString(file);
    });
  }

  getExcelFromJson(jsonData: any, fileName: any = 'paysprint') {

    fileName = fileName + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }
}
