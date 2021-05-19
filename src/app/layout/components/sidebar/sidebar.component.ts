import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {AuthService, CommonService, NetworkService} from '../../../shared/services';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    showMenu = false;
    permission: any = [];
    username: any;
    userId: any;

    @Output() collapsedEvent = new EventEmitter<boolean>();
    avatar = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).avatar;

    constructor(
        private translate: TranslateService,
        private authService: AuthService,
        private networkService: NetworkService,
        public commonService: CommonService,
        public router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.username = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).username;
        this.userId = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).id;
        this.networkService.getPermission(this.userId).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.permission = response.data;
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
            }
        );
    }


    onLoggedOutClick() {
        this.authService.logout().subscribe();
    }
}
