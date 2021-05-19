import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AutoLogoutService} from '../shared/services';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    constructor(
        private translate: TranslateService,
        private autoLogout: AutoLogoutService
    ) {
    }

    ngOnInit() {
        this.translate.use('vi');
    }

}
