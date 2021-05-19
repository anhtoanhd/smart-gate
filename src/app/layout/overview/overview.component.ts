import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NetworkService} from '../../shared/services';
import {AppConst} from '../../appconst';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    today = new Date();

    dayData: any = {};
    chartData: any = [];
    departmentData: any = [];
    healthyData: any = [];
    tab = 'back_office';
    filter: any = {};
    listShift = [];
    absentData = [];
    lateData = [];
    isLoading: any;

    constructor(
        private networkService: NetworkService
    ) {
    }

    ngOnInit() {
        this.getBackOfficeWorkTime().then(
            () => {
                this.filter['shift'] = this.listShift[0].id;
                this.loadData(this.tab, this.filter['shift']);
            }
        );
    }

    loadData(type, shift_id) {
        this.isLoading = true;
        const params = {};
        params['type'] = type;
        if (shift_id) {
            params['shift_id'] = shift_id;
        }
        const homepage$ = this.networkService.get(AppConst.OVERVIEW_API, params);
        const table$ = this.networkService.get(AppConst.OVERVIEW_TABLE_API, params);
        forkJoin(homepage$, table$).subscribe(
            response => {
                if (response && response[0] && !response[0].error_code) {
                    this.dayData = {...response[0].data.data_for_day};
                    this.chartData = [...response[0].data.data_chart];
                    this.departmentData = [...response[0].data.data_day_department];
                } else {
                    this.dayData = {};
                    this.chartData = [];
                    this.departmentData = [];
                }
                if (response && response[1] && !response[1].error_code) {
                    this.absentData = [...response[1].data.user_not_on_day.data];
                    this.lateData = [...response[1].data.user_to_late.data];
                } else {
                    this.absentData = [];
                    this.lateData = [];
                }
            },
            error => {
                this.dayData = {};
                this.chartData = [];
                this.departmentData = [];
                this.absentData = [];
                this.lateData = [];
                console.log(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    onShiftChange() {
        this.loadData(this.tab, this.filter['shift']);
    }

    onTabChange(tabType: string) {
        if (this.tab !== tabType) {
            this.tab = tabType;
        }
        if (this.tab === 'shift_office') {
            this.getListShift().then(
                () => {
                    if (this.listShift.length) {
                        this.filter['shift'] = this.listShift[this.listShift.length - 1].id;
                        this.loadData(this.tab, this.filter['shift']);
                    } else {
                        this.chartData = [];
                        this.departmentData = [];
                        this.absentData = [];
                        this.lateData = [];
                        this.dayData = {};
                    }
                }
            );
        } else {
            this.getBackOfficeWorkTime().then(
                () => {
                    this.filter['shift'] = this.listShift[0].id;
                    this.loadData(this.tab, this.filter['shift']);
                }
            );
        }
    }

    getBackOfficeWorkTime(): Promise<void> {
        return new Promise<void>(((resolve, reject) => {
            this.networkService.get(AppConst.WORKTIME_RANGE_NEW_API, {}).subscribe(
                response => {
                    if (response && !response.error_code && response.data) {
                        this.listShift = [];
                        response.data.forEach(shift => {
                            this.listShift = [...this.listShift, shift];
                        });
                    }
                },
                error => {
                    console.log(error);
                },
                () => {
                    resolve();
                }
            );
        }));
    }

    getListShift(): Promise<void> {
        return new Promise<void>(((resolve, reject) => {
            this.networkService.get(AppConst.SHIFT_LIST_API, {}, 0).subscribe(
                response => {
                    if (response && !response.error_code && response.data) {
                        this.listShift = [];
                        response.data.data.forEach(shift => {
                            this.listShift = [...this.listShift, shift];
                        });
                    }
                },
                error => {
                    console.log(error);
                },
                () => {
                    resolve();
                }
            );
        }));
    }
}
