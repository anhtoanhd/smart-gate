import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../../shared/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    username = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).username;
    avatar = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).avatar;

    constructor(
        private translate: TranslateService,
        public router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
    }

    onLoggedout() {
        this.authService.logout().subscribe();
    }

}
