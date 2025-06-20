import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

import {IDynamicTableActionConfig, IDynamicTableOptions} from "@core/common/dynamic-table/dynamic-table-types";
import waitUntil from "async-wait-until";
import { DynamicTableService } from './dynamic-table.service';
import { IHeaderNew } from '@core/types/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None
})
export class DynamicTableComponent<T extends Record<string, any>> implements OnInit {
  @Input('data') data: Observable<{list: T[], header: IHeaderNew, options?: IDynamicTableOptions}>;
  originalOrder = (): number => {
    return 0;
  }
  constructor(
    public _DynamicTableService:DynamicTableService
  ) {

  };

  private GetColumnValue(data: T, name: string) {
    if(name.includes('.')) {
        let keys = name.split('.');
        let temp:any = data;
        keys.forEach(key => {
            temp = temp[key];
        });
        return temp;
    }
    return (data as any)[name] ?? null;
  }

  protected OnEdit(data: T) {
    (data as any)['edit'] = true;
  }

  async ngOnInit() {
   waitUntil(() => this.data != undefined).then(() => {
      this.data.subscribe((res) => {
       console.log("tableres",res);
      });
    });
   }


  async Save(item: T, options: IDynamicTableOptions) {
    console.log(options);
    if((item as any)['edit']) {
      (item as any)['edit'] = false;
    }
    else {
      return;
    }
    if(options && options.actions && options.actions['save']) {
      options.actions['save'].action(item);
    }
  }

  async Delete(item: T, options: IDynamicTableOptions) {
    console.log(options);
    if(options && options.actions && options.actions['delete']) {
      options.actions['delete'].action(item);
    }
  }

  getActionsKeys(actions: any): string[] {
    return Object.keys(actions);
  }

  // This method determines whether to show a button based on its key
  shouldShowButton(actionKey: string, options: IDynamicTableOptions) {
    if (actionKey === 'edit') {
      return  options?.editable;
    }
    if (actionKey === 'delete') {
      return options.deletable;
    }
    return false;
  }

  // This method executes the action associated with a button
  executeAction(actionKey: string, item: any, options: IDynamicTableOptions) {
    const action = (options.actions?.[actionKey]);
    if (action && action.action) {
      action.action(item);
    }
  }

  getIcon(actionKey: string, item: any, options: IDynamicTableOptions):string{
    const action:any = (options.actions?.[actionKey]);
      if (action && typeof action.icon === 'function') {
        return action.icon(item);
      }
      return action.icon;
    }

}
