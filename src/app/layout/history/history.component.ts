import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService, NetworkService} from '../../shared/services';
import {MatDialog} from '@angular/material/dialog';
import {BsDaterangepickerDirective, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, viLocale} from 'ngx-bootstrap/chronos';
import {AppConst} from '../../appconst';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    @ViewChild('datepicker', {static: false}) private _picker: BsDaterangepickerDirective;
    listStaff = [];
    selectedStaffs: any = [];
    itemPerPage = 10;
    order = 'time_access_at';
    direction = 'desc';
    currentPage = 1;
    listLocation = [];
    listLocationTemp = [];
    filter = {};
    url = '';
    isLoading = false;
    bsConfig = {
        displayOneMonthRange: true,
        displayMonths: 2,
        selectFromOtherMonth: true,
        showWeekNumbers: false,
        maxDateRange: 60
    };
    totalPages: number;

    constructor(
        private modalService: NgbModal,
        public commonService: CommonService,
        private dialog: MatDialog,
        private networkService: NetworkService,
        private localeService: BsLocaleService
    ) {
        defineLocale('vi', viLocale);
        localeService.use('vi');
    }

    ngOnInit() {
        this.filter['date_range'] = [new Date(new Date().setDate(new Date().getDate() - 7)),
            new Date(new Date().setDate(new Date().getDate()))];
        this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 0);
        this.loadAllArea();
    }

    loadAllArea() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code && response.data) {
                    this.listLocation = [...response.data];
                    this.listLocationTemp = [...response.data];
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            }
        );
    }

    loadHistoryData(itemPerPage, currentPage, order, direction, areas, workTimes, key_word, isExport) {
        const params = {};
        params['limit'] = itemPerPage;
        params['page'] = currentPage;

        if (order) {
            params['order'] = order;
        }
        if (direction) {
            params['direction'] = direction;
        }
        if (areas && areas.length) {
            areas.forEach((area, index) => {
                params['area_id[' + index + ']'] = area.id;
            });
        }
        if (workTimes && workTimes.length) {
            params['start_time'] = this.commonService.formatSqlDate(workTimes[0]);
            params['end_time'] = this.commonService.formatSqlDate(workTimes[1]);
        }
        if (key_word) {
            params['key_word'] = key_word;
        }
        params['export_to_excel'] = isExport ? isExport : 0;
        this.isLoading = true;
        this.networkService.get(AppConst.HISTORY_API, params).subscribe(
            response => {
                if (isExport === 0) {
                    this.totalPages = Number(response.data.last_page);
                    this.listStaff = [...response.data.data];
                    if (this.currentPage > 1 && this.listStaff.length === 0) {
                        this.currentPage--;
                        this.setPage(itemPerPage, this.currentPage, order, direction, areas, workTimes, key_word, isExport);
                    }
                } else {
                    this.url = AppConst.HOST_URL + '/' + response.data.path;
                }
            },
            error => {
                this.commonService.confirmDialog(this.dialog, 'error', 'System error!', null, null, true, 1000);
                console.log(error);
            },
            () => {
                if (this.url) {
                    const link = document.createElement('a');
                    link.href = this.url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    this.url = '';
                }
                this.isLoading = false;
            });
    }

    setPage(itemPerPage, page, order, direction, area_id, workTimes, key_word, isExport) {
        this.currentPage = page;
        this.selectedStaffs = [];
        this.loadHistoryData(itemPerPage, page, order, direction, area_id, workTimes, key_word, isExport);
    }

    onDateRangeShow(event) {
        const dayHoverHandler = event.dayHoverHandler;

        event.dayHoverHandler = (hoverEvent) => {
            const {cell, isHovered} = hoverEvent;

            if ((isHovered &&
                !!navigator.platform &&
                /iPad|iPhone|iPod/.test(navigator.platform)) &&
                'ontouchstart' in window
            ) {
                (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
            }

            return dayHoverHandler(hoverEvent);
        };
    }

    onChooseDateRange(event) {
        if (event.length) {
            this.currentPage = 1;
            this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
                this.filter['key'], 0);
        }
    }

    onExportClick() {
        this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 1);
    }

    onLocationSearch(event) {
        this.listLocation = this.listLocationTemp.filter(location => {
            return this.commonService.xoa_dau(location.name.toLowerCase()).includes(this.commonService.xoa_dau(event.target.value.toLowerCase()));
        });
    }

    onLocationChange(event, area) {
        area.isChecked = !!event.target.checked;
        this.filter['areas'] = [];
        this.listLocation.forEach(lc => {
            if (lc.isChecked) {
                this.filter['areas'].push(lc);
            }
        });
        this.currentPage = 1;
        this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 0);
    }

    onResetFilterClick() {
        this.filter = {};
        this.listLocation.forEach(location => {
            location.isChecked = false;
        });
        this.currentPage = 1;
        this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 0);
    }

    onSearchInputChange(event: string) {
        this.filter['key'] = event;
        this.loadHistoryData(this.itemPerPage, 1, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 0);
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.loadHistoryData(this.itemPerPage, this.currentPage, this.order, this.direction, this.filter['areas'], this.filter['date_range'],
            this.filter['key'], 0);
    }
}
