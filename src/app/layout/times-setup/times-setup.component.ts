import {Component, OnInit} from '@angular/core';
import {CommonService, NetworkService} from '../../shared/services';
import {AppConst} from '../../appconst';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-times-setup',
    templateUrl: './times-setup.component.html',
    styleUrls: ['./times-setup.component.scss']
})
export class TimesSetupComponent implements OnInit {

    workTimes = [];
    checkin: any = {};
    checkout: any = {};
    allow: any = {};
    timeError = false;
    resErrors: any = {};
    diffInTime = 24 * 60 * 60;
    diffOutTime = 24 * 60 * 60;
    diffInErr = {};
    diffOutErr = {};
    isLoading: any;

    constructor(
        private networkService: NetworkService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadWorkTime();
    }

    loadWorkTime(timeDelay = 500) {
        if (timeDelay) {
            this.isLoading = true;
        }
        this.networkService.get(AppConst.WORK_TIME_LIST_NEW, {}, timeDelay).subscribe(
            response => {
                if (response && !response.error_code) {
                    if (response.data.time) {
                        this.workTimes = [];
                        for (const key in response.data.time) {
                            if (response.data.time.hasOwnProperty(key)) {
                                this.workTimes.push(response.data.time[key]);
                            }
                        }
                        this.workTimes.map(wt => {
                            wt['err'] = [];
                            for (let i = 0; i < 7; i++) {
                                if (!wt['wday'][i]) {
                                    wt['wday'][i] = {
                                        start_at: null, end_at: null, err: {start: false, end: false}, enable: {start: true, end: true}
                                    };
                                } else {
                                    wt['wday'][i] = {
                                        start_at: {
                                            hour: Number(wt['wday'][i].start_at.substr(0, 2)),
                                            minute: Number(wt['wday'][i].start_at.substr(3, 2))
                                        },
                                        end_at: {
                                            hour: Number(wt['wday'][i].end_at.substr(0, 2)),
                                            minute: Number(wt['wday'][i].end_at.substr(3, 2))
                                        },
                                        err: {start: false, end: false},
                                        enable: {start: true, end: true}
                                    };
                                }
                            }
                        });
                        if (this.workTimes.length === 1) {
                            if (this.workTimes[0].name === 'Ca sáng') {
                                this.workTimes.push({
                                    name: 'Ca chiều',
                                    err: [],
                                    wday: {
                                        0: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        1: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        2: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        3: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        4: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        5: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        6: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}}
                                    },
                                });
                            } else {
                                this.workTimes.push({
                                    name: 'Ca sáng',
                                    err: [],
                                    wday: {
                                        0: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        1: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        2: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        3: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        4: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        5: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                        6: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}}
                                    },
                                });
                            }
                        } else if (!this.workTimes.length) {
                            this.workTimes.push({
                                name: 'Ca sáng',
                                err: [],
                                wday: {
                                    0: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    1: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    2: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    3: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    4: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    5: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    6: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}}
                                },
                            });
                            this.workTimes.push({
                                name: 'Ca chiều',
                                err: [],
                                wday: {
                                    0: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    1: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    2: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    3: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    4: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    5: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}},
                                    6: {start_at: '', end_at: '', err: {start: false, end: false}, enable: {start: true, end: true}}
                                },
                            });
                        }
                    }
                    if (response.data.time_checkin_before || response.data.time_checkin_after) {
                        this.checkin.before = response.data.time_checkin_before;
                        this.checkin.after = response.data.time_checkin_after;
                        this.checkin.isChecked = true;
                    }
                    if (response.data.time_checkout_before || response.data.time_checkout_after) {
                        this.checkout.before = response.data.time_checkout_before;
                        this.checkout.after = response.data.time_checkout_after;
                        this.checkout.isChecked = true;
                    }
                    if (response.data.time_going_late || response.data.time_leave_soon) {
                        this.allow.late = response.data.time_going_late;
                        this.allow.early = response.data.time_leave_soon;
                        this.allow.isChecked = true;
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

    onFormSubmit() {
        const formData = new FormData();
        this.workTimes.forEach((wt, index) => {
            const wday_value = [];
            for (const key in wt['wday']) {
                if (wt['wday'].hasOwnProperty(key)) {

                    if (!wt['wday'][key]['start_at']) {
                        const hour_e = <HTMLInputElement>document.querySelector(`#start-${index}-${key} fieldset input[aria-label="Hours"]`);
                        const minute_e = <HTMLInputElement>document.querySelector(`#start-${index}-${key} fieldset input[aria-label="Minutes"]`);
                        if (hour_e && hour_e.value && minute_e && !minute_e.value) {
                            wt['wday'][key]['start_at'] = {hour: Number(hour_e.value), minute: 0};
                        }
                    }

                    if (!wt['wday'][key]['end_at']) {
                        const hour_e = <HTMLInputElement>document.querySelector(`#end-${index}-${key} fieldset input[aria-label="Hours"]`);
                        const minute_e = <HTMLInputElement>document.querySelector(`#end-${index}-${key} fieldset input[aria-label="Minutes"]`);

                        if (hour_e && hour_e.value && minute_e && !minute_e.value) {
                            wt['wday'][key]['end_at'] = {hour: Number(hour_e.value), minute: 0};
                        }
                    }

                    const start = wt['wday'][key]['start_at'];
                    const end = wt['wday'][key]['end_at'];
                    if (start && end) {
                        const diff = ((new Date(2020, 0, 1, end.hour, end.minute)).getTime() - (new Date(2020, 0, 1, start.hour, start.minute)).getTime())
                            / 1000;
                        if (diff < this.diffInTime) {
                            this.diffInTime = diff;
                            this.diffInErr = {index: index, wday: key};
                        }
                        if ((new Date(2020, 0, 1, end.hour, end.minute)).getTime() <=
                            (new Date(2020, 0, 1, start.hour, start.minute)).getTime()) {
                            this.workTimes[index]['wday'][key]['err']['start'] = true;
                            this.workTimes[index]['wday'][key]['err']['end'] = true;
                            this.workTimes[index]['err'] = [...['Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc']];
                        }
                    }
                    if (index > 0) {
                        const preEnd = this.workTimes[index - 1]['wday'][key]['end_at'];
                        if (preEnd && start) {
                            const diff = ((new Date(2020, 0, 1, start.hour, start.minute)).getTime() -
                                (new Date(2020, 0, 1, preEnd.hour, preEnd.minute)).getTime())
                                / 1000;
                            if (diff < this.diffOutTime) {
                                this.diffOutTime = diff;
                                this.diffOutErr = {index: index, wday: key};
                            }
                            if ((new Date(2020, 0, 1, start.hour, start.minute)).getTime()
                                <= (new Date(2020, 0, 1, preEnd.hour, preEnd.minute)).getTime()) {
                                this.workTimes[index]['wday'][key]['err']['start'] = true;
                                this.workTimes[index - 1]['wday'][key]['err']['end'] = true;
                                this.workTimes[index]['err'] = [...['Thời gian bắt đầu phải lớn hơn thời gian kết thúc của ca trước']];
                            }
                        }
                    }

                    if ((wt['wday'][key].start_at && wt['wday'][key].end_at)) {
                        wday_value.push(key);
                        formData.append('time[' + index + '][wday][' + key + ']',
                            `${wt['wday'][key].start_at.hour}:${wt['wday'][key].start_at.minute},${wt['wday'][key].end_at.hour}:${wt['wday'][key].end_at.minute}`);
                    }
                }
            }
            if (wday_value.length) {
                formData.append('time[' + index + '][name]', wt.name);
                formData.append('time[' + index + '][time_range_id]', wt.time_range_id ? wt.time_range_id : '');
                formData.append('time[' + index + '][wday_value]', wday_value.join(','));
            }
        });
        if (this.checkin.isChecked) {
            if (this.checkin.after && this.checkin.after * 60 > this.diffInTime) {
                this.resErrors['checkin_after'] = [...['Thời gian checkin vào làm việc phải nhỏ hơn độ dài ca']];
                this.workTimes[this.diffInErr['index']]['wday'][this.diffInErr['wday']]['err']['start'] = true;
                this.workTimes[this.diffInErr['index']]['wday'][this.diffInErr['wday']]['err']['end'] = true;
                return;
            }
            if (this.checkin.before && this.checkin.before * 60 > this.diffOutTime) {
                this.resErrors['checkin_before'] = [...['Thời gian checkin vào làm việc phải nhỏ hơn thời gian giữa 2 ca']];
                this.workTimes[this.diffOutErr['index']]['wday'][this.diffOutErr['wday']]['err']['start'] = true;
                this.workTimes[this.diffOutErr['index'] - 1]['wday'][this.diffOutErr['wday']]['err']['end'] = true;
                return;
            }
            formData.set('time_checkin_before', this.checkin.before);
            formData.set('time_checkin_after', this.checkin.after);
        }
        if (this.checkout.isChecked) {
            if (this.checkout.before && this.checkout.before * 60 > this.diffInTime) {
                this.resErrors['checkout_before'] = [...['Thời gian checkout ra về phải nhỏ hơn độ dài ca']];
                this.workTimes[this.diffInErr['index']]['wday'][this.diffInErr['wday']]['err']['start'] = true;
                this.workTimes[this.diffInErr['index']]['wday'][this.diffInErr['wday']]['err']['end'] = true;
                return;
            }
            if (this.checkout.after && this.checkout.after * 60 > this.diffOutTime) {
                this.resErrors['checkin_before'] = [...['Thời gian checkout ra về phải nhỏ hơn thời gian giữa 2 ca']];
                this.workTimes[this.diffOutErr['index']]['wday'][this.diffOutErr['wday']]['err']['start'] = true;
                this.workTimes[this.diffOutErr['index'] - 1]['wday'][this.diffOutErr['wday']]['err']['end'] = true;
                return;
            }
            formData.set('time_checkout_before', this.checkout.before);
            formData.set('time_checkout_after', this.checkout.after);
        }
        if (this.allow.isChecked) {
            if (this.checkin.isChecked) {
                if (this.allow.late > this.checkin.after) {
                    this.resErrors['allow_late'] = [...['Thời gian đi trễ phải nhỏ hơn thời gian checkin và làm việc']];
                    this.resErrors['checkin_after'] = [...['']];
                    return;
                }
                if (this.allow.early > this.checkout.before) {
                    this.resErrors['allow_early'] = [...['Thời gian về sớm phải nhỏ hơn thời gian checkout ra về']];
                    this.resErrors['checkout_before'] = [...['']];
                    return;
                }
            }
            formData.set('time_going_late', this.allow.late);
            formData.set('time_leave_soon', this.allow.early);
        }

        this.workTimes.forEach((wt, index) => {
            for (const key in wt['wday']) {
                if (wt['wday'].hasOwnProperty(key)) {
                    if (wt['wday'][key]['err']['start'] || wt['wday'][key]['err']['end']) {
                        this.timeError = true;
                    }
                }
            }
        });

        if (this.timeError) {
            return;
        } else {
            this.isLoading = true;
            this.networkService.post(AppConst.WORK_TIME_STORE_NEW, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.commonService.confirmDialog(this.dialog, 'success', 'Edit success!', null, null, true, 1000).then(
                            () => {
                                this.loadWorkTime(0);
                            }
                        );
                    } else {
                        if (response.error_code === 2) {
                            this.workTimes[response.data[0].number]['err'] = [...response.data[0].name];
                        }
                        if (response.error_code === 1) {
                            this.commonService.confirmDialog(this.dialog, 'error', `${response.message}`, null, null, false);
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
    }

    onStartTimeChange(i: number, number: number, event) {
        this.diffInTime = 24 * 60 * 60;
        this.diffOutTime = 24 * 60 * 60;
        this.resErrors = {};
        this.diffOutErr = {};
        const target = event.target;
        if (target.getAttribute('aria-label') === 'Hours' && target.value >= 24) {
            event.target.value = this.commonService.convertTimeStringFormat(event.target.value % 24);
        }

        if (target.getAttribute('aria-label') === 'Minutes' && target.value >= 60) {
            event.target.value = this.commonService.convertTimeStringFormat(event.target.value % 60);
        }

        this.workTimes.forEach((wt, index) => {
            for (let j = 0; j < 7; j++) {
                wt['wday'][number]['err']['start'] = false;
                wt['wday'][number]['err']['end'] = false;
                wt['wday'][j]['enable']['start'] = true;
                wt['wday'][j]['enable']['end'] = true;
            }
        });
        this.timeError = false;
        this.workTimes[i]['err'] = '';

        for (let j = 1; j < 6; j++) {
            if (j !== number) {
                if (this.workTimes[i]['wday'][number]['start_at'] && !this.workTimes[i]['wday'][j]['start_at']) {
                    this.workTimes[i]['wday'][j]['start_at'] = {...this.workTimes[i]['wday'][number]['start_at']};
                }
            }
        }

        if (!this.workTimes[i]['wday'][number]['start_at']) {
            const this_e = <HTMLInputElement>document.querySelector(`#start-${i}-${number} fieldset input[aria-label="Hours"]`);
            for (let j = 1; j < 6; j++) {
                if (j !== number) {
                    const other_e = <HTMLInputElement>document.querySelector(`#start-${i}-${j} fieldset input[aria-label="Hours"]`);
                    if (!other_e.value && this_e.value) {
                        other_e.value = this_e.value;
                    }
                }
            }
        }

    }

    onEndTimeChange(i: number, number: number, event) {
        this.diffInTime = 24 * 60 * 60;
        this.diffOutTime = 24 * 60 * 60;
        this.resErrors = {};
        this.diffInErr = {};
        this.diffOutErr = {};
        const target = event.target;
        if (target.getAttribute('aria-label') === 'Hours' && target.value >= 24) {
            event.target.value = this.commonService.convertTimeStringFormat(event.target.value % 24);
        }

        if (target.getAttribute('aria-label') === 'Minutes' && target.value >= 60) {
            event.target.value = this.commonService.convertTimeStringFormat(event.target.value % 60);
        }

        this.workTimes.forEach((wt, index) => {
            for (let j = 1; j < 6; j++) {
                wt['wday'][number]['err']['start'] = false;
                wt['wday'][number]['err']['end'] = false;
                wt['wday'][j]['enable']['start'] = true;
                wt['wday'][j]['enable']['end'] = true;
            }
        });
        this.timeError = false;
        this.workTimes[i]['err'] = [];

        for (let j = 1; j < 6; j++) {
            if (j !== number) {
                if (this.workTimes[i]['wday'][number]['end_at'] && !this.workTimes[i]['wday'][j]['end_at']) {
                    this.workTimes[i]['wday'][j]['end_at'] = {...this.workTimes[i]['wday'][number]['end_at']};
                }
            }
        }

        if (!this.workTimes[i]['wday'][number]['end_at']) {
            const this_e = <HTMLInputElement>document.querySelector(`#end-${i}-${number} fieldset input[aria-label="Hours"]`);
            for (let j = 1; j < 6; j++) {
                if (j !== number) {
                    const other_e = <HTMLInputElement>document.querySelector(`#end-${i}-${j} fieldset input[aria-label="Hours"]`);
                    if (!other_e.value && this_e.value) {
                        other_e.value = this_e.value;
                    }
                }
            }
        }
    }

    onAdvanceInput(key) {
        this.diffInTime = 24 * 60 * 60;
        this.diffOutTime = 24 * 60 * 60;
        this.resErrors = {};
        this.diffInErr = {};
        this.diffOutErr = {};
        this.workTimes.forEach((wt, index) => {
            for (let j = 1; j < 6; j++) {
                wt['wday'][j]['err']['start'] = false;
                wt['wday'][j]['err']['end'] = false;
            }
        });
    }

    get checkValid(): boolean {
        let invalid = true;
        this.workTimes.forEach(wt => {
            for (const key in wt['wday']) {
                if (wt['wday'].hasOwnProperty(key)) {
                    if (wt['wday'][key].start_at && wt['wday'][key].end_at) {
                        invalid = false;
                    }
                }
            }
        });
        return !invalid;
    }
}
