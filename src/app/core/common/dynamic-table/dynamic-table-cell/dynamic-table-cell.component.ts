import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IDynamicTableColumnConfig, IDynamicTableOptions } from "@core/common/dynamic-table/dynamic-table-types";
import { ApiRequestService } from '@core/services/api-request.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DocModalComponent } from '@shared/components/doc-modal/doc-modal.component';
import { Modal } from 'bootstrap';
@Component({
    selector: 'app-dynamic-table-cell',
    templateUrl: './dynamic-table-cell.component.html',
    styleUrls: ['./dynamic-table-cell.component.scss']
})
export class DynamicTableCellComponent<T extends Record<string, any>> implements OnInit {

    @Input('data') data: T;
    @Input('column') column: IDynamicTableColumnConfig;
    @Input('edit') edit: boolean = false;
    @Input('option') option: IDynamicTableOptions;
      @ViewChild('permissionModal') permissionModal!: TemplateRef<any>;
  permissionList: Array<any> = [];


    constructor(private _ApiRequestService: ApiRequestService,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef 
    ) { }

    ngOnInit(): void {
        for (let key in this.column) {
            if ((this.column as any)[key] == null && key.includes('.')) {
                let keys = key.split('.');
                let temp = this.column;
                keys.forEach((key, index) => {
                    if (index === keys.length - 1) {
                        (temp as any)[key] = this.column;
                    }
                    temp = (temp as any)[key];
                });
                (this.data as any)[key] = temp;
            }
        }
    }

    parseData(data: T, column: IDynamicTableColumnConfig) {
        let name = column.name;
        let final: any = undefined;
        if (name.includes('.')) {
            try {
                let keys = name.split('.');
                let temp: any = data;
                keys.forEach(key => {
                    temp = temp[key];
                });
                let values = data[column.name + 'Values'] ?? column.options;
                if (values) {
                    for (let key in values) {
                        if (key == temp) {
                            final ??= values[key];
                        }
                    }
                }
                final ??= temp;
            }
            catch (e) {
                return '';
            }
        }
        let values = data[column.name + 'Values'] ?? column.options;
        if (values)
            final ??= values[data[name]] ?? data[name] ?? '';
        final ??= data[name] ?? '';
        if (typeof final === 'object') {
            final = final['name'];
        }
        return final;
    }

    setData(data: T, name: string, value: any) {
        if (name.includes('.')) {
            let keys = name.split('.');
            let temp: any = data;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    temp[key] = data;
                }
                temp = temp[key];
            });
            return;
        }
        (data as any)[name] = value;
        return;
    }

    handleChange(datu: T, name: string) {
        if (this.option?.actions && Object.keys(this.option?.actions ?? {}).includes(name)) {
            this.option?.actions[name].action(datu);
        }
    }

    async handleFileChange(event: any, item: any, name: string) {
        if (event.target.files.length > 0) {
            let image = event.target.files[0];
            let imageURL = await this._ApiRequestService.fileUpload(image)
            item[name] = imageURL;
            if (this.option?.actions && Object.keys(this.option?.actions ?? {}).includes(name)) {
                this.option?.actions[name].action(item);
            }
        }
    }

    isObject(value: unknown) {
        return typeof value === 'object';
    }

    documentPopup(file: any) {
        let customConfig: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            size: "lg",
            centered: true,
            windowClass: "modal-holder",
        };
        let modalRef = this.modalService.open(DocModalComponent, customConfig);
        modalRef.componentInstance.data = { img: file };
        modalRef.componentInstance.dialogRef = modalRef;
    }
    handleViewMore(item: any) {
         this.permissionList = [...item.permissionCopy]; 
    this.modalService.open(this.permissionModal, { size: 'lg', scrollable: true });

    }
    getPermissionCopy(data: any): any[] {
        return Array.isArray(data?.permissionCopy) ? data.permissionCopy : [];
    }
    closeModal() {
    this.modalService.dismissAll();
  }
   
}
