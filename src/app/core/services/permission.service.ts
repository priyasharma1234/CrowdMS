import {Injectable} from '@angular/core';
import { StoreService } from './store.service';

interface Permission {
    module: string;
    permission: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    userPermissions: Permission[] = [];

    constructor(private store: StoreService) {
        this.userPermissions = this.store.get('userPermissions') || [];
    }

    hasPermission(permission: string, module?: string) {
        if (module) {
            const modulePermission = this.userPermissions.find((item) => item.module === module);
            if (modulePermission) {
                return modulePermission.permission.includes(permission);
            }
            return false;
        }
        return this.userPermissions.some((item) => item.permission.includes(permission));
    }

    hasModule(module: string) {
        console.log(" this.userPermissions1111111111", this.userPermissions)
        return this.userPermissions.find((item) => item.module === module);
    }

    setPermissions(permissions: Permission[]) {
        this.userPermissions = permissions;
        this.store.set('userPermissions11', permissions);
    }
}
