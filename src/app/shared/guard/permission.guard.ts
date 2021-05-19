import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService, CommonService, NetworkService} from '../services';
import {AppConst} from '../../appconst';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

    permission = [];
    userId: any;

    constructor(
        private router: Router,
        private authService: AuthService,
        private commonService: CommonService,
        private networkService: NetworkService,
    ) {
        this.userId = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).id;
        this.loadPermission(this.userId);
        this.permission = JSON.parse(localStorage.getItem('gatePer'));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const expectedPermission = route.data.permission;

        if (!this.commonService.checkArrayIncludeArrayItem(this.permission, expectedPermission)) {
            this.router.navigate(['overview']);
            return false;
        }
        return true;
    }

    loadPermission(id: any) {
        this.networkService.get(AppConst.ROLE_FOR_USER_API + '/' + id, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    localStorage.setItem('gatePer', JSON.stringify(response.data));
                    this.permission = response.data;
                }
            },
            error => {
                console.log(error);
            }
        );
    }

}

