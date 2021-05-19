import {Component, OnInit} from '@angular/core';
import {CommonService, NetworkService} from '../../../shared/services';
import {AppConst} from '../../../appconst';
import {StaffShiftFormComponent} from '../../components/staff-shift-form/staff-shift-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-work-calendar-wizard',
    templateUrl: './work-calendar-wizard.component.html',
    styleUrls: ['./work-calendar-wizard.component.scss']
})
export class WorkCalendarWizardComponent implements OnInit {

    step = 1;
    locations = [];
    area_id: number;
    weekDays = [];
    now = new Date();
    today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    shifts = [];
    area = {};
    data = {};
    colors = AppConst.COLORS;
    isLoading: any;

    constructor(
        private networkService: NetworkService,
        public commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.weekDays = [...this.commonService.getWeekDate(this.today)];
        this.loadListLocation();
    }

    loadListLocation() {
        this.networkService.get(AppConst.WORK_SHIFT_AREA, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data && response.data.areas.length) {
                    response.data.areas.forEach(area => {
                        this.locations = [...this.locations, {id: area.id, name: area.name}];
                    });
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    onNextWeekClick() {
        const d = new Date(this.weekDays[6]['date'].getTime() + 24 * 60 * 60 * 1000);
        this.weekDays = [...this.commonService.getWeekDate(d)];
        this.getData(this.area_id, `${this.weekDays[0]['date'].getFullYear()}-${this.weekDays[0]['date'].getMonth() + 1}-${this.weekDays[0]['date'].getDate()}`,
            `${this.weekDays[6]['date'].getFullYear()}-${this.weekDays[6]['date'].getMonth() + 1}-${this.weekDays[6]['date'].getDate()}`);
    }

    onPrevWeekClick() {
        const d = new Date(this.weekDays[0]['date'].getTime() - 24 * 60 * 60 * 1000);
        this.weekDays = [...this.commonService.getWeekDate(d)];
        this.getData(this.area_id, `${this.weekDays[0]['date'].getFullYear()}-${this.weekDays[0]['date'].getMonth() + 1}-${this.weekDays[0]['date'].getDate()}`,
            `${this.weekDays[6]['date'].getFullYear()}-${this.weekDays[6]['date'].getMonth() + 1}-${this.weekDays[6]['date'].getDate()}`);
    }

    getData(area_id, start_time, end_time, delayTime = 500) {
        if (delayTime) {
            this.isLoading = true;
        }
        const params = {};
        params['area_id'] = area_id;
        params['start_time'] = start_time;
        params['end_time'] = end_time;
        this.networkService.get(AppConst.WORK_CALENDAR_INFO, params, delayTime).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    this.shifts = [...response.data.shifts];
                    this.area = {...response.data.area};
                    this.data = {...response.data.data};
                }
            },
            error => {
                console.log(error);
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    onOpenStaffShiftFormClick(shift, date, isEdit) {
        const dialogRef = this.dialog.open(StaffShiftFormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                shift,
                area: this.area,
                startDate: date,
                endDate: null,
                editable: isEdit
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                        () => {
                            this.getData(this.area_id,
                                `${this.weekDays[0]['date'].getFullYear()}-${this.weekDays[0]['date'].getMonth() + 1}-${this.weekDays[0]['date'].getDate()}`,
                                `${this.weekDays[6]['date'].getFullYear()}-${this.weekDays[6]['date'].getMonth() + 1}-${this.weekDays[6]['date'].getDate()}`,
                                0);
                        }
                    );
                }
            } else {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        });
    }

    onStepFormSubmit() {
        this.step = 2;
        this.getData(this.area_id, `${this.weekDays[0]['date'].getFullYear()}-${this.weekDays[0]['date'].getMonth() + 1}-${this.weekDays[0]['date'].getDate()}`,
            `${this.weekDays[6]['date'].getFullYear()}-${this.weekDays[6]['date'].getMonth() + 1}-${this.weekDays[6]['date'].getDate()}`);
    }
}
