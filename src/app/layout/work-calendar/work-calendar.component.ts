import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {FullCalendarComponent} from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {EventInput} from '@fullcalendar/core/structs/event';
import {AppConst} from '../../appconst';
import {StaffShiftFormComponent} from '../components/staff-shift-form/staff-shift-form.component';
import { MatDialog } from '@angular/material/dialog';
import {fromEvent} from 'rxjs';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, viLocale} from 'ngx-bootstrap/chronos';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-work-calendar',
    templateUrl: './work-calendar.component.html',
    styleUrls: ['./work-calendar.component.scss']
})
export class WorkCalendarComponent implements OnInit, AfterViewInit {

    @ViewChild('calendar', {static: false}) calendar: FullCalendarComponent;
    listLocation = [];
    listLocationTemp = [];
    listDepartment = [];
    listDepartmentTemp = [];
    listShift = [];
    listShiftTemp = [];
    filter: any = {};
    calendarPlugins = [dayGridPlugin, interactionPlugin];
    calendarWeekends = true;
    calendarEvents: EventInput[] = [];
    viewMode: any = 'staff';
    monthString: any;
    weekDays = [];
    now = new Date();
    today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    shiftData = {};
    monthData = {};
    staffData = {};
    shiftsChosen = [];
    selectedShifts = [];
    colors = AppConst.COLORS;
    shiftDayData: any = {};
    isLoading = false;
    date: Date;
    bsConfig = {
        selectFromOtherMonth: true,
        showWeekNumbers: false,
        minMode: 'month'
    };
    fakeRowData = new Array(6);
    page = 1;
    limit = 10;
    key_word = '';
    listStaff = [];
    totalStaff = 0;

    constructor(
        private networkService: NetworkService,
        public commonService: CommonService,
        private dialog: MatDialog,
        private renderer: Renderer2,
        private localeService: BsLocaleService,
        private route: ActivatedRoute
    ) {
        defineLocale('vi', viLocale);
        localeService.use('vi');
    }

    ngOnInit() {
        this.filter['month'] = new Date();
        this.weekDays = [...this.commonService.getWeekDate(this.filter['month'])];
        const firstDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth(), 1);
        const lastDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth() + 1, 0);
        this.loadListLocation(this.commonService.formatSqlDate(firstDate), this.commonService.formatSqlDate(lastDate));
        this.loadDepartment();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.viewMode === 'month') {
                this.monthString = this.commonService.formatMonthVn(this.calendar.getApi().view.currentStart);
            }
        }, 1000);
    }

    onMonthChange(event) {
        if (event) {
            const firstDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth(), 1);
            const lastDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth() + 1, 0);
            this.loadListLocation(this.commonService.formatSqlDate(firstDate), this.commonService.formatSqlDate(lastDate));
            if (this.viewMode === 'month') {
                this.calendar.getApi().gotoDate(this.filter['month']);
                this.monthString = this.commonService.formatMonthVn(this.calendar.getApi().view.currentStart);
            }
            if (this.viewMode === 'shift' || this.viewMode === 'staff') {
                this.weekDays = [...this.commonService.getWeekDate(this.filter['month'])];
            }
        }
    }


    onDepartmentChange(event, department) {
        department.isChecked = event.target.checked;
        this.filter['departments'] = [];
        this.listDepartment.forEach(d => {
            if (d.isChecked) {
                this.filter['departments'].push(d);
            }
        });
        this.callApiWithViewMode();
    }

    onLocationChange(event, area) {
        area.isChecked = event.target.checked;
        if (area.isChecked) {
            this.filter['location'] = {...area};
        } else {
            this.filter['location'] = null;
        }
        this.listLocation.forEach(lc => {
            if (lc.id !== area.id) {
                lc.isChecked = false;
            }
        });
        this.filter['shifts'] = [];
        this.callApiWithViewMode();
    }

    onShiftChange(event, shift) {
        shift.isChecked = event.target.checked;
        this.filter['shifts'] = [];
        this.listShift.forEach(s => {
            if (s.isChecked) {
                this.filter['shifts'].push(s);
            }
        });
        if (this.filter['shifts'].length) {
            this.shiftsChosen = [...this.filter['shifts']];
        } else {
            this.shiftsChosen = [...this.selectedShifts];
        }
        this.callApiWithViewMode();
    }

    onTabChange(viewMode) {
        this.shiftDayData = {};
        if (viewMode === 'shift') {
            if (this.filter['location']) {
                if (this.filter['location']) {
                    this.date = this.filter['month'];
                    this.callShiftApi();
                }
            }
        }
        if (this.viewMode === 'month') {
            setTimeout(() => {
                this.monthString = this.commonService.formatMonthVn(this.calendar.getApi().view.currentStart);
            }, 1000);
            if (this.filter['location']) {
                this.callMonthApi();
            }
        }

        if (this.viewMode === 'staff') {
            if (this.filter['location']) {
                if (this.filter['location']) {
                    this.date = this.filter['month'];
                    this.callStaffApi(false);
                }
            }
        }
    }

    onPrevMonthClick() {
        if (this.viewMode === 'month') {
            this.calendar.getApi().prev();
            this.monthString = this.commonService.formatMonthVn(this.calendar.getApi().view.currentStart);
            this.filter['month'] = this.calendar.getApi().view.currentStart;
            if (this.filter['location']) {
                this.callMonthApi();
            }
        }
        if (this.viewMode === 'shift') {
            this.date = new Date(this.weekDays[0]['date'].getTime() - 24 * 60 * 60 * 1000);
            this.refreshWeekAndFilterMonth();
            if (this.filter['location']) {
                this.callShiftApi();
            }
        }
        if (this.viewMode === 'staff') {
            this.date = new Date(this.weekDays[0]['date'].getTime() - 24 * 60 * 60 * 1000);
            this.refreshWeekAndFilterMonth();
            if (this.filter['location']) {
                this.callStaffApi(false);
            }
        }
    }

    onNextMonthClick() {
        if (this.viewMode === 'month') {
            this.calendar.getApi().next();
            this.monthString = this.commonService.formatMonthVn(this.calendar.getApi().view.currentStart);
            this.filter['month'] = this.calendar.getApi().view.currentStart;
            if (this.filter['location']) {
                this.callMonthApi();
            }
        }
        if (this.viewMode === 'shift') {
            this.date = new Date(this.weekDays[6]['date'].getTime() + 7 * 24 * 60 * 60 * 1000);
            this.refreshWeekAndFilterMonth();
            if (this.filter['location']) {
                this.callShiftApi();
            }
        }
        if (this.viewMode === 'staff') {
            this.date = new Date(this.weekDays[this.weekDays.length - 1]['date'].getTime() + 24 * 60 * 60 * 1000);
            this.refreshWeekAndFilterMonth();
            if (this.filter['location']) {
                this.callStaffApi(false);
            }
        }
    }

    getShiftData(area_id, start_time, end_time, shift_ids, department_ids, key_word, monthly: true | false, shift: true | false) {
        this.isLoading = true;
        const params = {};
        params['area_id'] = area_id;
        params['start_time'] = start_time;
        params['end_time'] = end_time;
        if (shift_ids && shift_ids.length) {
            shift_ids.forEach((sh, index) => {
                params['shift_ids[' + index + ']'] = sh.id;
            });
        }
        if (department_ids && department_ids.length) {
            department_ids.forEach((dp, index) => {
                params['department_ids[' + index + ']'] = dp.id;
            });
        }
        if (key_word) {
            params['key_word'] = key_word;
        }
        if (monthly) {
            params['monthly'] = monthly;
        }
        if (shift) {
            params['shift'] = shift;
        }
        this.networkService.get(AppConst.WORK_CALENDAR_INFO, params).subscribe(
            response => {
                    this.calendarEvents = [];
                    if (response && !response.error_code && response.data) {
                        if (response.data.shifts && response.data.shifts.length) {
                            this.listShift = [...response.data.shifts];
                            this.filter['shifts'].forEach(s => {
                                if (s.isChecked) {
                                    this.listShift[this.listShift.indexOf(this.listShift.find(sh => sh.id === s.id))].isChecked = true;
                                    this.listShiftTemp[this.listShift.indexOf(this.listShift.find(sh => sh.id === s.id))].isChecked = true;
                                }
                            });
                            this.listShiftTemp = [...this.listShift];
                        }
                        if (response.data.shiftsChosen && response.data.shiftsChosen.length) {
                            this.shiftsChosen = [...response.data.shiftsChosen];
                            this.selectedShifts = [...response.data.shiftsChosen];
                        }
                        if (!monthly) {
                            this.shiftData = {...response.data.data};
                        } else {
                            this.monthData = {...response.data.data};
                            if (this.monthData['shifts'] && this.monthData['shifts'].length) {
                                this.monthData['shifts'].forEach(sh => {
                                    const colorIndex = this.listShift.indexOf(this.listShift.find(x => x.id === sh.shift_id));
                                    const e = {
                                        id: sh.shift_id,
                                        title: `${sh.shift_name}`,
                                        start: new Date(sh.start_time),
                                        end: new Date(sh.end_time),
                                        editable: false,
                                        backgroundColor: '#FFF9F7',
                                        borderColor: `${this.colors[colorIndex]}`,
                                        textColor: '#828282'
                                    };
                                    this.calendarEvents.push(e);
                                });
                            }
                            this.calendar.getApi().removeAllEvents();
                            this.calendar.getApi().addEventSource(this.calendarEvents);
                            this.calendar.ngOnDestroy();
                            this.calendar.ngAfterViewInit();
                            this.calendar.getApi().gotoDate(this.filter['month']);
                        }
                    }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    getStaffData(page, limit, area_id, shift_id, department_id, key_word, start_time, end_time, isLoadmore) {
        this.isLoading = true;
        const params = {};
        params['page'] = page;
        params['limit'] = limit;
        params['area_id'] = area_id;
        params['start_time'] = start_time;
        params['end_time'] = end_time;
        if (shift_id && shift_id.length) {
            shift_id.forEach((sh, index) => {
                params['shift_ids[' + index + ']'] = sh.id;
            });
        }
        if (department_id && department_id.length) {
            department_id.forEach((sh, index) => {
                params['department_ids[' + index + ']'] = sh.id;
            });
        }
        if (key_word) {
            params['key_word'] = key_word;
        }

        this.networkService.get(AppConst.WORK_CALENDAR_FOLLOW_STAFF, params).subscribe(
            response => {
                setTimeout(() => {
                    if (response && !response.error_code && response.data) {
                        this.totalStaff = Number(response.data.total_item);
                        if (isLoadmore) {
                            response.data.staff.forEach(staff => {
                                this.listStaff = [...this.listStaff, staff];
                            });
                            for (const key of Object.keys(response.data.data)) {
                                this.staffData[key] = response.data.data[key];
                            }
                        } else {
                            this.listStaff = [...response.data.staff];
                            this.staffData = {...response.data.data};
                        }
                        if (response.data.shifts && response.data.shifts.length) {
                            this.listShift = [...response.data.shifts];
                            this.filter['shifts'].forEach(s => {
                                if (s.isChecked) {
                                    this.listShift[this.listShift.indexOf(this.listShift.find(sh => sh.id === s.id))].isChecked = true;
                                    this.listShiftTemp[this.listShift.indexOf(this.listShift.find(sh => sh.id === s.id))].isChecked = true;
                                }
                            });
                            this.listShiftTemp = [...this.listShift];
                        }
                        if (response.data.shiftsChosen && response.data.shiftsChosen.length) {
                            this.shiftsChosen = [...response.data.shiftsChosen];
                            this.selectedShifts = [...response.data.shiftsChosen];
                        }
                    }
                    this.isLoading = false;
                }, 1000);
            },
            error => {
                console.log(error);
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                this.isLoading = false;
            }
        );
    }

    loadListLocation(startDate: string, endDate: string) {
        this.isLoading = true;
        const params = {};
        params['start_time'] = startDate;
        params['end_time'] = endDate;
        this.networkService.get(AppConst.WORK_CALENDAR_AREA, params).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    if (response.data.areas && response.data.areas.length) {
                        this.listLocation = [...response.data.areas];
                        this.listLocationTemp = [...response.data.areas];
                    } else {
                        this.listLocation = [];
                    }

                    this.route.queryParams.subscribe(prs => {
                        if (prs['area']) {
                            this.filter['location'] = this.listLocation.find(location => location.id === Number(prs['area']));
                            this.callApiWithViewMode();
                        } else {
                            if (this.listLocation.length) {
                                if (!this.filter['location']) {
                                    this.filter['location'] = {...this.listLocation[0]};
                                    // tslint:disable-next-line:max-line-length
                                    this.listLocation[this.listLocation.indexOf(this.listLocation.find(lc => lc.id === this.filter['location'].id))].isChecked = true;
                                }
                            } else {
                                this.filter['location'] = null;
                            }
                            this.callApiWithViewMode();
                        }
                    });
                    this.listShift = [];
                    this.shiftsChosen = [];
                    this.filter['shifts'] = [];
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

    loadDepartment() {
        this.networkService.get(AppConst.DEPARTMENT_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listDepartment = [...response.data];
                    this.listDepartmentTemp = [...response.data];
                    this.filter['departments'] = [];
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    onOpenStaffShiftFormClick(shift, date, isEdit) {
        const dialogRef = this.dialog.open(StaffShiftFormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                shift,
                area: this.filter['location'],
                startDate: date,
                endDate: null,
                editable: isEdit
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000);
                    if (this.viewMode === 'shift') {
                        this.callShiftApi();
                    }
                    if (this.viewMode === 'month') {
                        this.callMonthApi();
                    }
                }
            } else {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        });
    }

    dayRender(event) {
        if (this.monthData['count']) {
            if (this.monthData['count'][this.commonService.formatSqlDate(event.date)] &&
                this.monthData['count'][this.commonService.formatSqlDate(event.date)].length) {
                const divHtml: HTMLDivElement = this.renderer.createElement('div');
                divHtml.className = 'd-flex flex-center align-end h-100 p-b-12';
                divHtml.innerHTML = `
                   <div class="edit-staff" id="${this.commonService.formatSqlDate(event.date)}">
                       Tổng ca: ${this.monthData['count'][this.commonService.formatSqlDate(event.date)].length}
                   </div>
               `;
                this.renderer.appendChild(event.el, divHtml);
                const button = <HTMLElement>document.getElementById(`${this.commonService.formatSqlDate(event.date)}`);
                fromEvent(button, 'click').subscribe(
                    response => {
                        const btnArr = Array.from(document.getElementsByClassName('edit-staff'));
                        btnArr.forEach(btn => {
                            if (this.commonService.formatSqlDate(event.date) === btn.getAttribute('id')) {
                                btn.className = 'edit-staff active';
                            } else {
                                btn.className = 'edit-staff';
                            }
                        });
                        this.shiftDayData = {
                            dayOfWeek: this.commonService.getDayOfWeekVN(event.date),
                            date: event.date,
                            data: this.monthData['count'][this.commonService.formatSqlDate(event.date)]
                        };
                        this.shiftDayData.data.map(dayData => {
                            const obj = this.shiftsChosen.find(shift => shift.id === dayData.shift_id);
                            dayData['colorIndex'] = this.shiftsChosen.indexOf(obj);
                        });
                    }
                );
            }
        }
    }

    onEditClick(shiftDay) {
        const shift = {
            id: shiftDay.shift_id,
            name: shiftDay.shifts_name,
            time_start: shiftDay.shifts_time_start,
            time_end: shiftDay.shifts_time_end,
            is_activated: this.shiftsChosen.find(s => s.id === shiftDay.shift_id).is_activated
        };
        const dialogRef = this.dialog.open(StaffShiftFormComponent, {
            disableClose: true,
            width: '813px',
            data: {
                shift,
                area: this.filter['location'],
                startDate: new Date(shiftDay.date_at),
                endDate: null,
                editable: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000);
                    if (this.viewMode === 'shift') {
                        this.callShiftApi();
                    }
                    if (this.viewMode === 'month') {
                        this.callMonthApi();
                    }
                }
            } else {
                if (typeof result === 'boolean') {
                    this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                }
            }
        });
    }

    callMonthApi() {
        this.shiftDayData = {};
        const firstDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth(), 1);
        const lastDate = new Date(this.filter['month'].getFullYear(), this.filter['month'].getMonth() + 1, 0);
        this.getShiftData(this.filter['location'].id,
            `${this.commonService.formatSqlDate(firstDate)}`,
            `${this.commonService.formatSqlDate(lastDate)}`,
            this.filter['shifts'], this.filter['departments'], this.key_word, true, false);
    }

    callShiftApi() {
        const last = this.weekDays.length - 1;
        this.getShiftData(this.filter['location'].id,
            `${this.commonService.formatSqlDate(this.weekDays[0]['date'])}`,
            `${this.commonService.formatSqlDate(this.weekDays[last]['date'])}`,
            this.filter['shifts'], this.filter['departments'], this.key_word, false, true);
    }

    callStaffApi(isLoadmore) {
        const last = this.weekDays.length - 1;
        if (!isLoadmore) {
            this.page = 1;
        }
        if (this.filter['location']) {
            this.getStaffData(this.page, this.limit, this.filter['location'].id, this.filter['shifts'], this.filter['departments'], this.key_word,
                `${this.commonService.formatSqlDate(this.weekDays[0]['date'])}`,
                `${this.commonService.formatSqlDate(this.weekDays[last]['date'])}`, isLoadmore);
        } else {
            this.listStaff = [];
        }
    }

    onStaffViewScroll() {
        if (this.viewMode === 'staff') {
            if (this.totalStaff > this.listStaff.length) {
                this.page++;
                this.callStaffApi(true);
            }
        }
    }

    onResetFilterClick() {

    }

    onLocationSearch(event) {
        this.listLocation = this.listLocationTemp.filter(location => {
            return this.commonService.xoa_dau(location.name).toLowerCase().includes(this.commonService.xoa_dau(event.target.value).toLowerCase());
        });
    }

    onDepartmentSearch(event) {
        this.listDepartment = this.listDepartmentTemp.filter(department => {
            return this.commonService.xoa_dau(department.name).toLowerCase().includes(this.commonService.xoa_dau(event.target.value).toLowerCase());
        });
    }

    onSearchInputChange(event) {
        this.key_word = event;
        this.callApiWithViewMode();
    }

    onShiftSearch(event) {
        this.listShift = this.listShiftTemp.filter(shift => {
            return this.commonService.xoa_dau(shift.name).toLowerCase().includes(this.commonService.xoa_dau(event.target.value).toLowerCase());
        });
    }
    private refreshWeekAndFilterMonth() {
        this.weekDays = [...this.commonService.getWeekDate(this.date)];
        this.filter['month'] = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    }

    private callApiWithViewMode() {
        switch (this.viewMode) {
            case 'shift':
                this.callShiftApi();
                break;
            case 'month':
                this.callMonthApi();
                break;
            case 'staff':
                this.callStaffApi(false);
                break;
        }
    }

    getIndex(arr: any[], item, key) {
        return arr.indexOf(arr.find(i => i[key] === item[key]));
    }
}
