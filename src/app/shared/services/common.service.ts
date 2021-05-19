import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ConfirmComponent} from '../../layout/components/confirm/confirm.component';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() {
    }

    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
        // calculate total pages
        const totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    public confirmDialog(dialog: MatDialog,
                         type: 'delete' | 'modify' | 'success' | 'error',
                         title: string,
                         notification: string,
                         note: string,
                         autoClose = false,
                         autoCloseTime = 0) {
        const dialogRef = dialog.open(ConfirmComponent, {
            disableClose: true,
            width: '465px',
            data: {
                type,
                title,
                notification,
                note,
                autoClose,
                autoCloseTime
            }
        });

        return new Promise((resolve, reject) => {
            dialogRef.afterClosed().subscribe(result => {
                resolve(result);
            });
        });
    }

    public formatMonthVn(date) {
        if (date) {
            if (typeof date === 'string') {
                const d = new Date(date.replace(/-/g, '/'));
                if (!isNaN(d.getFullYear())) {
                    return `${d.getMonth() + 1}/${d.getFullYear()}`;
                }
            } else {
                return `${date.getMonth() + 1}/${date.getFullYear()}`;
            }
            return date;
        }
    }


    public formatDateVn(date) {
        if (date) {
            if (typeof date === 'string') {
                const d = new Date(date.replace(/-/g, '/'));
                if (!isNaN(d.getFullYear())) {
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                }
            } else {
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
        }
        return date;
    }

    public formatSqlDate(date) {
        if (date) {
            if (typeof date === 'string') {
                const d = new Date(date.replace(/-/g, '/'));
                if (!isNaN(d.getFullYear())) {
                    let month: string;
                    let day: string;
                    if (d.getMonth() + 1 < 10) {
                        month = `0${d.getMonth() + 1}`;
                    } else {
                        month = `${d.getMonth() + 1}`;
                    }

                    if (d.getDate() < 10) {
                        day = `0${d.getDate()}`;
                    } else {
                        day = `${d.getDate()}`;
                    }
                    return `${d.getFullYear()}-${month}-${day}`;
                }
            } else {
                let month: string;
                let day: string;
                if (date.getMonth() + 1 < 10) {
                    month = `0${date.getMonth() + 1}`;
                } else {
                    month = `${date.getMonth() + 1}`;
                }

                if (date.getDate() < 10) {
                    day = `0${date.getDate()}`;
                } else {
                    day = `${date.getDate()}`;
                }
                return `${date.getFullYear()}-${month}-${day}`;
            }
        }
        return date;
    }

    public formatTimeVn(time) {
        if (time) {
            if (typeof time === 'string') {
                const t = new Date(time.replace(/-/g, '/'));
                if (!isNaN(t.getHours())) {
                    let hour = '';
                    let minute = '';
                    if (t.getHours() < 10) {
                        hour = `0${t.getHours()}`;
                    } else {
                        hour = `${t.getHours()}`;
                    }

                    if (t.getMinutes() < 10) {
                        minute = `0${t.getMinutes()}`;
                    } else {
                        minute = `${t.getMinutes()}`;
                    }

                    return `${hour}:${minute}`;
                }
            } else {
                let hour = '';
                let minute = '';

                if (time.getHours() < 10) {
                    hour = `0${time.getHours()}`;
                } else {
                    hour = `${time.getHours()}`;
                }

                if (time.getMinutes() < 10) {
                    minute = `0${time.getMinutes()}`;
                } else {
                    minute = `${time.getMinutes()}`;
                }
                return `${hour}:${minute}`;
            }
        }

        return time;
    }

    formatDateTimeVN(date) {
        if (date) {
            if (typeof date === 'string') {
                const d = new Date(date.replace(/-/g, '/'));
                if (!isNaN(d.getFullYear())) {
                    let hour = '';
                    let minute = '';
                    let second = '';
                    if (d.getHours() < 10) {
                        hour = `0${d.getHours()}`;
                    } else {
                        hour = `${d.getHours()}`;
                    }

                    if (d.getMinutes() < 10) {
                        minute = `0${d.getMinutes()}`;
                    } else {
                        minute = `${d.getMinutes()}`;
                    }

                    if (d.getSeconds() < 10) {
                        second = `0${d.getSeconds()}`;
                    } else {
                        second = `${d.getSeconds()}`;
                    }

                    return `${hour}:${minute}:${second}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                }
            } else {
                let hour = '';
                let minute = '';
                let second = '';
                if (date.getHours() < 10) {
                    hour = `0${date.getHours()}`;
                } else {
                    hour = `${date.getHours()}`;
                }

                if (date.getMinutes() < 10) {
                    minute = `0${date.getMinutes()}`;
                } else {
                    minute = `${date.getMinutes()}`;
                }

                if (date.getSeconds() < 10) {
                    second = `0${date.getSeconds()}`;
                } else {
                    second = `${date.getSeconds()}`;
                }

                return `${hour}:${minute}:${second}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
        }
        return date;
    }

    convertTimeStringFormat(time) {
        if (time < 10) {
            return `0${time}`;
        }
        return `${time}`;
    }

    convertTimeStamp(date: Date, hour: string) {
        return new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hour}`).getTime();
    }

    public checkArrayIncludeArray(bigArr: any[], smallArr: any[]) {
        let result = true;
        smallArr.forEach(e => {
            if (!bigArr.includes(e)) {
                result = false;
            }
        });
        return result;
    }

    public checkArrayIncludeArrayItem(bigArr: any[], smallArr: any[]) {
        let result = false;
        smallArr.forEach(e => {
            if (bigArr.includes(e)) {
                result = true;
            }
        });
        return result;
    }

    public checkObjectKeyInArray(obj: any, arr: any[], key: string) {
        let result = false;
        arr.forEach(number => {
            if (number === obj[key]) {
                result = true;
            }
        });
        return result;
    }

    public swal() {
        return Swal.mixin({
            timer: 1000
        });
    }

    onDatepickerShown(event, datepicker) {
        const dayHoverHandler = event.dayHoverHandler;
        event.dayHoverHandler = (hoverEvent) => {
            const {cell, isHovered} = hoverEvent;
            if ((isHovered &&
                !!navigator.platform &&
                /iPad|iPhone|iPod/.test(navigator.platform)) &&
                'ontouchstart' in window
            ) {
                (datepicker as any)._datepickerRef.instance.daySelectHandler(cell);
            }
            return dayHoverHandler(hoverEvent);
        };
    }

    getWeekDate(date: Date) {
        const weekDays = [];
        const day = date.getDay();
        const firstD = new Date(date.getTime() - 24 * 60 * 60 * day * 1000);
        for (let i = 0; i < 7; i++) {
            const d = new Date(firstD.getTime() + 24 * 60 * 60 * i * 1000);
            const dateString = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            const sqlDateString = this.formatSqlDate(d);
            weekDays.push({date: d, dateString: dateString, sqlDate: sqlDateString, weekDay: this.getDayOfWeekVN(d)});
        }
        return weekDays;
    }

    getMonthDate(date: Date) {
        const monthDays = [];
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const monthLength = (lastDate.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000);
        for (let i = 0; i <= monthLength; i++) {
            const d = new Date(firstDate.getTime() + 24 * 60 * 60 * i * 1000);
            const dateString = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            const sqlDateString = this.formatSqlDate(d);
            monthDays.push({date: d, dateString: dateString, sqlDate: sqlDateString, weekDay: this.getDayOfWeekVN(d)});
        }
        return monthDays;
    }

    getDayOfWeek(date: Date) {
        switch (date.getDay()) {
            case 0:
                return 'Su';
            case 1:
                return 'Mo';
            case 2:
                return 'Tu';
            case 3:
                return 'We';
            case 4:
                return 'Th';
            case 5:
                return 'Fr';
            case 6:
                return 'Sa';
        }
    }

    getDayOfWeekVN(date: Date) {
        switch (date.getDay()) {
            case 0:
                return 'CN';
            case 1:
                return 'T2';
            case 2:
                return 'T3';
            case 3:
                return 'T4';
            case 4:
                return 'T5';
            case 5:
                return 'T6';
            case 6:
                return 'T7';
        }
    }

    xoa_dau(str) {
        if (str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D');;
        }
        return str;
    }

    getDiffTime(time1: {hour: number, minute: number}, time2: {hour: number, minute: number}) {
        if (time1 && time2) {
            if ((new Date(2020, 0, 1, time1.hour, time1.minute)).getTime() < (new Date(2020, 0, 1, time2.hour, time2.minute)).getTime()) {
                const diff = (new Date(2020, 0 , 1, time2.hour, time2.minute)).getTime() - new Date(2020, 0 , 1, time1.hour, time1.minute).getTime();
                return Math.abs(diff / 1000 / 60);
            } else {
                const diff = (new Date(2020, 0 , 2, time2.hour, time2.minute)).getTime() - (new Date(2020, 0 , 1, time1.hour, time1.minute)).getTime();
                return Math.abs(diff / 1000 / 60);
            }
        }
        return 0;
    }

    joinField(arr: any[], key: string, seperator = ', ') {
        let strArr;
        if (key) {
            strArr = arr.map(item => item[key]);
        } else {
            strArr = arr.map(item => this.formatDateVn(item));
        }
        return strArr.join(seperator);
    }

}
