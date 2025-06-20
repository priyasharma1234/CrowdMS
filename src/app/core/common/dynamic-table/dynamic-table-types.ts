import {environment} from "../../../../environments/environment";

export type IDynamicTableConfig<T> = {
    header: IDynamicTableColumnConfig[],
    list: T[],
    options?: IDynamicTableOptions
}
export type IDynamicTableColumnConfig = {
    isShow: boolean | false | true,
    isOrder: boolean | false | true,
    isSearch:  boolean | false | true,
    isSort:  boolean | false | true,
    isEdit:  boolean | false | true,
    isAlways:boolean | false | true,
    canEdit: 'always' | 'onedit' | 'never',
    name: string,
    options: any, //change this
    row: number,
    type: 'text' | 'inrSh' | 'inr' | 'textarea' | 'number' | 'select' | 'date' | 'time' | 'datetime' | 'checkbox' | 'radio' | 'file' | 'image' | 'color' | 'password' | 'email' | 'tel' | 'url' | 'range' | 'search' | 'month' | 'week' | 'hidden' | 'button' | 'submit' | 'reset',
    label: string,
    values: any,
    edit: boolean
}

export type IDynamicTableActionConfig<T> = {
    label: string,
    icon: string | ((data: T) => string),
    btnClass?: string,
    isImg?: boolean,
    action: (data: T) => void,
    disabled?: (data: T) => boolean
}

export interface IReportConfig {
    url: any,
    formData: any | Function,
    fileName: string,
    fileTypes?: any[];
    baseUrl?: any,
    exportIcon?: boolean,
    downloadFunc?: Function,
}

export type IDynamicTableOptions = {
    editable?: boolean,
    deletable?: boolean,
    selectable?: boolean,
    showHeader?: boolean,

    serverSearchBy?: 'local' | 'server' | null;
    showSort?: boolean;
    downloadReports?: IReportConfig | null;
    reloadTable?: boolean;
    rotateIt?: boolean;
    pagger?: (string | number)[];
    placeholder?: string | null;
    fromRec?: number;
    toRec?: number;
    showViewingBox?: boolean;
    sortBy?: string;
    sortDirection?: string;

    dtUpdateFnCallBack?: Function;

    actions?: { [key: string]: IDynamicTableActionConfig<any> },
    header?: {},
    pagination?: IDynamicTablePaginationConfig
}

export interface IDynamicTablePaginationConfig {
    currentPage: number;
    itemsPerPage: number | any;
    totalItems: number;
    totalPages: number | any;
    records?: any[];
    mainData?: any[];
    itemLengthStartFrom: number,
    pagger?: (string | number)[];
}

export class DynamicCustTblCnfg {
    private m_dynamicTableOption: IDynamicTableOptions;

    /**
     * Constructor for DynamicCustTblCnfg.
     *
     *
     *
     *
     * @author Himanshu Chawla (himanshu@cipherpay.in)
     * @createdAt 2024-11-02 5:43 PM
     * @param _dynamicTableOption
     */
    constructor(_dynamicTableOption: IDynamicTableOptions | undefined = undefined) {
        this.m_dynamicTableOption = _dynamicTableOption ?? {
            serverSearchBy: 'server',
            showSort: false,
            downloadReports: null,
            reloadTable: false,
            rotateIt: false,
            pagger: ['All', 10, 50, 100, 200, 500],
            fromRec: 0,
            toRec: 0,
            showViewingBox: true,
            sortBy: '',
            sortDirection: 'asc',
            pagination: new DynamicTablePaginationCnfg().dynamicTablePagination,
            actions: {},
            showHeader: true,
        };
    }

    SetShowSort(_value:any) {
        this.m_dynamicTableOption.showSort = _value;
        return this;
    }

    SetShowHeader(_value:any) {
        this.m_dynamicTableOption.showHeader = _value;
        return this;
    }

    SetDownloadReports(_value:any) {
        this.m_dynamicTableOption.downloadReports = _value;
        return this;
    }

    SetReloadTable(_value:any) {
        this.m_dynamicTableOption.reloadTable = _value;
        return this;
    }

    SetRotateIt(_value:any) {
        this.m_dynamicTableOption.rotateIt = _value;
        return this;
    }

    SetPagger(_value:any) {
        this.m_dynamicTableOption.pagger = _value;
        return this;
    }

    SetFromRec(_value:any) {
        this.m_dynamicTableOption.fromRec = _value;
        return this;
    }

    SetToRec(_value:any) {
        this.m_dynamicTableOption.toRec = _value;
        return this;
    }

    SetShowViewingBox(_value:any) {
        this.m_dynamicTableOption.showViewingBox = _value;
        return this;
    }

    SetSortBy(_value:any) {
        this.m_dynamicTableOption.sortBy = _value;
        return this;
    }

    SetSortDirection(_value:any) {
        this.m_dynamicTableOption.sortDirection = _value;
        return this;
    }

    SetPagination(_value:any) {
        this.m_dynamicTableOption.pagination = _value;
        return this;
    }

    SetActions(_value:any) {
        this.m_dynamicTableOption.actions = _value;
        return this;
    }

    SetCallbackFunction(_value:any) {
        this.m_dynamicTableOption.dtUpdateFnCallBack = _value;
        return this;
    }

    get dynamicTableOption(): IDynamicTableOptions {
        return this.m_dynamicTableOption;
    }

    SetEditable(_value:any) {
        this.m_dynamicTableOption.editable = _value;
        return this;
    }

    SetDeletable(_value:any) {
        this.m_dynamicTableOption.deletable = _value;
        return this;
    }

    SetSelectable(_value:any) {
        this.m_dynamicTableOption.selectable = _value;
        return this;
    }

    SetServerSearchBy(_value:any) {
        this.m_dynamicTableOption.serverSearchBy = _value;
        return this;
    }

    SetPlaceholder(_value:any) {
        this.m_dynamicTableOption.placeholder = _value;
        return this;
    }
}

export class DynamicTablePaginationCnfg {
    private m_dynamicTablePagination: IDynamicTablePaginationConfig;

    /**
     * Constructor for DynamicTablePaginationCnfg.
     * @param _dynamicTablePagination
     */
    constructor(_dynamicTablePagination: IDynamicTablePaginationConfig | undefined = undefined) {
        this.m_dynamicTablePagination = _dynamicTablePagination ?? {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0,
            records: [],
            mainData: [],
            itemLengthStartFrom: 0,
            pagger: ['All', 10, 50, 100, 200, 500],
        };
    }

    SetCurrentPage(_value:any) {
        this.m_dynamicTablePagination.currentPage = _value;
        return this;
    }

    SetItemsPerPage(_value:any) {
        this.m_dynamicTablePagination.itemsPerPage = _value;
        return this;
    }

    SetTotalItems(_value:any) {
        this.m_dynamicTablePagination.totalItems = _value;
        return this;
    }

    SetTotalPages(_value:any) {
        this.m_dynamicTablePagination.totalPages = _value;
        return this;
    }

    SetRecords(_value:any) {
        this.m_dynamicTablePagination.records = _value;
        return this;
    }

    SetMainData(_value:any) {
        this.m_dynamicTablePagination.mainData = _value;
        return this;
    }

    SetItemLengthStartFrom(_value:any) {
        this.m_dynamicTablePagination.itemLengthStartFrom = _value;
        return this;
    }

    SetPagger(_value:any) {
        this.m_dynamicTablePagination.pagger = _value;
        return this;
    }

    get dynamicTablePagination(): IDynamicTablePaginationConfig {
        return this.m_dynamicTablePagination;
    }
}

export class DynamicTableActionCnfg<T> {
    private m_dynamicTableAction: IDynamicTableActionConfig<T>;

    /**
     * Constructor for DynamicTableActionCnfg.
     * @param _dynamicTableAction
     */
    constructor(_dynamicTableAction: IDynamicTableActionConfig<T> | undefined = undefined) {
        this.m_dynamicTableAction = _dynamicTableAction ?? {
            label: '',
            icon: '',
            action: () => {
            },
            btnClass: '',
            isImg: false,
            disabled: () => false
        };
    }

    SetBtnClass(_value:any) {
        this.m_dynamicTableAction.btnClass = _value;
        return this;
    }

    SetIsImg(_value:any) {
        this.m_dynamicTableAction.isImg = _value;
        return this;
    }

    SetDisabled(_value:any) {
        this.m_dynamicTableAction.disabled = _value;
        return this;
    }


    SetLabel(_value:any) {
        this.m_dynamicTableAction.label = _value;
        return this;
    }

    SetIcon(_value:any) {
        this.m_dynamicTableAction.icon = _value;
        return this;
    }

    SetAction(_value:any) {
        this.m_dynamicTableAction.action = _value;
        return this;
    }

    get dynamicTableAction(): IDynamicTableActionConfig<T> {
        return this.m_dynamicTableAction;
    }
}

export class DynamicTableDownloadCnfg {
    private m_downloadOptions: IReportConfig;

    /**
     * Constructor for DynamicTableDownloadOptions.
     * @param _downloadOptions
     */
    constructor(_downloadOptions: IReportConfig | undefined = undefined) {
        this.m_downloadOptions = _downloadOptions ?? {
            url: null,
            formData: null,
            fileName: '',
            fileTypes: [],
            baseUrl: environment.baseUrl,
            exportIcon: false,
            downloadFunc: () => {
            }
        }
    }

    SetUrl(_value:any) {
        this.m_downloadOptions.url = _value;
        return this;
    }

    SetFormData(_value:any) {
        this.m_downloadOptions.formData = _value;
        return this;
    }

    SetFileName(_value:any) {
        this.m_downloadOptions.fileName = _value;
        return this;
    }

    SetFileTypes(_value:any) {
        this.m_downloadOptions.fileTypes = _value;
        return this;
    }

    SetBaseUrl(_value:any) {
        this.m_downloadOptions.baseUrl = _value;
        return this;
    }

    SetExportIcon(_value:any) {
        this.m_downloadOptions.exportIcon = _value;
        return this;
    }

    SetDownloadFunc(_value:any) {
        this.m_downloadOptions.downloadFunc = _value;
        return this;
    }

    get downloadOptions(): IReportConfig {
        return this.m_downloadOptions;
    }
}
