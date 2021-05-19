import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService, CommonService, NetworkService} from '../../shared/services';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ActivatedRoute} from '@angular/router';
import {AppConst} from '../../appconst';
import {BsDaterangepickerDirective, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {viLocale} from 'ngx-bootstrap/locale';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material/dialog';
import {ExportOptionComponent} from '../components/export-option/export-option.component';

@Component({
    selector: 'app-hr-report',
    templateUrl: './hr-report.component.html',
    styleUrls: ['./hr-report.component.scss']
})
export class HrReportComponent implements OnInit {

    @ViewChild('datepicker', {static: false}) private _picker: BsDaterangepickerDirective;
    tabType = '-1';
    reportType: any;
    type: any;
    totalPages: number;
    itemPerPage = 10;
    currentPage = 1;
    haveColumns = [];
    haveColumnTemp = [];
    needColumns = [];
    needColumnTemps = [];
    defaultReports = [];
    newReports = [];
    listDepartment: any = [];
    listLocation: any = [];
    listDepartmentTemp: any = [];
    listLocationTemp: any = [];
    isOpenFilterDropdown = false;
    isOpenFormDropdown = false;
    isOpenColumnDropdown = false;
    listStaff = [];
    key_word = '';
    departmentId: number;
    filters = [];
    today = new Date();
    beginMonth: Date;
    permission: any = [];
    reportName: any;
    save_column: any;
    sort: any = {};
    order = '';
    direction = '';
    userId: any;
    isLoading = false;
    url = '';
    filter = {};
    bsConfig = {
        displayOneMonthRange: true,
        displayMonths: 2,
        selectFromOtherMonth: true,
        showWeekNumbers: false,
        maxDateRange: 60
    };
    listOffice = [
        {id: 1, name: 'Khối văn phòng', value: 'back_office', isChecked: true},
        {id: 2, name: 'Khối ca kíp', value: 'shift_office', isChecked: false}
    ];
    nameNumberPattern = AppConst.VN_NAME_NUMBER_PATTERN;
    resErrors: any = {};

    constructor(
        private route: ActivatedRoute,
        public commonService: CommonService,
        private networkService: NetworkService,
        private localeService: BsLocaleService,
        private authService: AuthService,
        private modalService: NgbModal,
        private dialog: MatDialog
    ) {
        defineLocale('vi', viLocale);
        localeService.use('vi');
        this.beginMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
        this.filter['date_range'] = [this.beginMonth, this.today];
    }

    ngOnInit() {
        this.loadListDepartment();
        this.loadListLocation();
        this.route.queryParams.subscribe(params => {
            if (params['type']) {
                this.type = params['type'];
                this.filter['date_range'] = [this.today, this.today];
            }
            if (params['department']) {
                this.departmentId = Number(params['department']);
                this.filter['date_range'] = [this.today, this.today];
            }
        });
        if (this.type === 'absent') {
            this.tabType = '4';
        } else if (this.type === 'late') {
            this.tabType = '3';
        }
        this.userId = JSON.parse(localStorage.getItem('gateUser') || sessionStorage.getItem('gateUser')).id;
        this.networkService.getPermission(this.userId).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.permission = response.data;
                }
            }
        );
        this.filter['office'] = this.listOffice[0];
        this.filter['departments'] = [];
        this.filter['areas'] = [];
    }

    loadHrData(tabType: any, itemPerPage: number, currentPage, date_range: Date[], key_word: string,
               departments: any[], areas: any[], office_type, order, direction, template_id: any, isExport: any, typeExport) {
        this.isLoading = true;
        const params = {};
        params['tab_value'] = tabType;
        params['limit'] = itemPerPage;
        params['page'] = currentPage;
        if (date_range && date_range.length) {
            params['start_time'] = `${date_range[0].getFullYear()}-${date_range[0].getMonth() + 1}-${date_range[0].getDate()} 00:00:00`;
            params['end_time'] = `${date_range[1].getFullYear()}-${date_range[1].getMonth() + 1}-${date_range[1].getDate()} 23:59:59`;
        }
        if (key_word) {
            params['key_word'] = key_word;
        }
        if (order) {
            params['order'] = order;
        }
        if (direction) {
            params['direction'] = direction;
        }
        if (template_id) {
            params['template_id'] = template_id;
        }
        if (departments && departments.length > 0) {
            departments.forEach((department, index) => {
                params['department_id[' + index + ']'] = department.id;
            });
        }
        if (areas && areas.length > 0) {
            areas.forEach((area, index) => {
                params['area_id[' + index + ']'] = area.id;
            });
        }

        if (office_type) {
            params['office_type'] = office_type.value;
        }
        params['export_to_excel'] = isExport;
        if (typeExport) {
            params['type'] = typeExport;
        }
        this.networkService.get(AppConst.HR_API, params).subscribe(
            response => {
                if (response && !response.error_code) {
                    if (isExport === 0) {
                        this.totalPages = Number(response.data.last_page);
                        this.listStaff = response.data.data;
                        this.haveColumns = response.data.list_column;
                        this.haveColumnTemp = [...this.haveColumns];
                        this.needColumns = response.data.columns;
                        this.needColumns.sort((a, b) => {
                            if (Number(a.order) < Number(b.order)) {
                                return -1;
                            }
                        });
                        this.needColumnTemps = [...this.needColumns];
                        if (this.tabType === '-1' || this.tabType === '4') {
                            this.needColumns =
                                this.needColumns.filter(coloumn => coloumn.field_name !== 'first_time' && coloumn.field_name !== 'last_time');
                            this.needColumnTemps =
                                this.needColumnTemps.filter(coloumn => coloumn.field_name !== 'first_time' && coloumn.field_name !== 'last_time');
                            this.haveColumns =
                                this.haveColumns.filter(coloumn => coloumn.field_name !== 'first_time' && coloumn.field_name !== 'last_time');
                            this.haveColumnTemp =
                                this.haveColumnTemp.filter(coloumn => coloumn.field_name !== 'first_time' && coloumn.field_name !== 'last_time');
                        }
                        if (this.currentPage > 1 && this.listStaff.length === 0) {
                            this.currentPage--;
                            this.setPage(tabType, itemPerPage, this.currentPage,
                                date_range, key_word, departments, areas, office_type, order, direction, template_id, 0);
                        }
                        if (response.data.template_reports) {
                            this.tabType = response.data.template_reports.tab_value.toString();
                            this.filter['departments'] = [];
                            this.filter['areas'] = [];
                            this.filters = [];
                            if (response.data.template_reports.department_id) {
                                this.listDepartment.forEach(dp => {
                                    if (response.data.template_reports.department_id.includes(dp.id.toString())) {
                                        dp.isChecked = true;
                                        this.filter['departments'].push(dp);
                                        this.filters.push(dp);
                                    }
                                });
                            }

                            if (response.data.template_reports.area_id) {
                                this.listLocation.forEach(ar => {
                                    if (response.data.template_reports.area_id.includes(ar.id.toString())) {
                                        this.filter['areas'].push(ar);
                                        this.filters.push(ar);
                                        ar.isChecked = true;
                                    }
                                });
                            }

                            if (response.data.template_reports.office_type) {
                                this.listOffice.forEach(office => {
                                    if (office.value === response.data.template_reports.office_type) {
                                        this.filter['office'] = office;
                                    }
                                });
                            }
                        }

                        if (response.data.start_time && response.data.end_time) {
                            if (this.filter['date_range'][0].getTime() !== (new Date(response.data.start_time)).getTime() ||
                                this.filter['date_range'][1].getTime() !== (new Date(response.data.end_time)).getTime()) {
                                this.filter['date_range'] = [new Date(response.data.start_time), new Date(response.data.end_time)];
                            }
                        }
                    } else {
                        this.url = AppConst.HOST_URL + '/' + response.data.path;
                    }
                } else {
                    this.commonService.confirmDialog(this.dialog, 'error', response.message, null, null, true, 1000);
                }
            },
            error => {
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
            }
        );
    }

    loadListDepartment() {
        this.networkService.get(AppConst.DEPARTMENT_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listDepartment = [...response.data];
                    this.listDepartmentTemp = [...response.data];
                    if (this.departmentId) {
                        this.listDepartment.forEach(dp => {
                            if (dp.id === this.departmentId) {
                                this.filter['departments'].push(dp);
                                this.filters.push(dp);
                                dp.isChecked = true;
                            }
                        });
                    }
                    this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
                        this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    loadListLocation() {
        this.networkService.get(AppConst.LOCATION_ALL_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.listLocation = response.data ? response.data : [];
                    this.listLocationTemp = response.data ? response.data : [];
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    loadListReport() {
        this.networkService.get(AppConst.REPORT_LIST_API, {}).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.newReports = response.data.new_template;
                    this.defaultReports = response.data.default;
                    this.defaultReports.reverse();
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    setPage(tabType: any, itemPerPage: number, currentPage, date_range: Date[], key_word: string,
            departments: any[], areas: any[], office_type, order, direction, template_id: any, isExport: any, typeExport = '') {
        this.currentPage = currentPage;
        this.loadHrData(tabType, itemPerPage, currentPage, date_range, key_word,
            departments, areas, office_type, order, direction, template_id, isExport, typeExport);
    }

    drop(event: CdkDragDrop<string[], any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    onDepartmentSearch(event) {
        this.listDepartment = this.listDepartmentTemp.filter(department => {
            return department.name.toLowerCase().includes(event.target.value.toLowerCase());
        });
    }

    onLocationSearch(event) {
        this.listLocation = this.listLocationTemp.filter(location => {
            return location.name.toLowerCase().includes(event.target.value.toLowerCase());
        });
    }

    onRemoveClick(item) {
        this.isOpenColumnDropdown = true;
        const index = this.needColumns.indexOf(item, 0);
        this.needColumns.splice(index, 1);
        this.haveColumns.push(item);
    }

    onFormSaveClick(template) {
        this.isOpenFormDropdown = false;
        this.modalService.open(template, {centered: true, backdrop: 'static'});
    }

    onColumnCancelClick() {
        this.isOpenColumnDropdown = false;
        this.needColumns = [...this.needColumnTemps];
        this.haveColumns = [...this.haveColumnTemp];
    }

    onAddColumnClick(item) {
        this.isOpenColumnDropdown = true;
        const index = this.haveColumns.indexOf(item, 0);
        this.haveColumns.splice(index, 1);
        this.needColumns.push(item);
    }

    onTabChange(tabType) {
        this.isOpenColumnDropdown = false;
        this.tabType = tabType;
        this.reportType = null;
        this.sort = {};
        this.order = '';
        this.direction = '';
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onFormClick() {
        this.isOpenColumnDropdown = false;
        this.isOpenFilterDropdown = false;
        this.loadListReport();
    }

    onColumnApplyClick() {
        this.reportType = null;
        const cls = [];
        this.needColumns.forEach(cl => {
            cls.push(cl.field_name);
        });
        this.needColumnTemps = [...this.needColumns];
        this.haveColumnTemp = [...this.haveColumns];
        const formData = new FormData();
        formData.set('column', cls.join(','));
        formData.set('save_column', '1');
        if (this.save_column) {
            this.networkService.post(AppConst.COLUMN_STORE_API, formData).subscribe(
                response => {
                    if (response && !response.error_code) {
                        this.isOpenColumnDropdown = false;
                        this.setPage(this.tabType, this.itemPerPage, 1, this.filter['date_range'], this.key_word,
                            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
                    }
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.isOpenColumnDropdown = false;
        }

    }

    onTemplateCancelClick() {
        this.modalService.dismissAll();
        this.reportName = '';
    }

    onTemplateApplyClick() {
        const formData = new FormData();
        formData.set('name', this.reportName ? this.reportName : 'Mẫu báo cáo tùy chỉnh ' + this.newReports.length);
        formData.set('report_type', '1');
        const dps = [];
        this.filter['departments'].forEach(dp => {
            dps.push(dp.id);
        });
        const ars = [];
        this.filter['areas'].forEach(ar => {
            ars.push(ar.id);
        });
        const cls = [];
        this.needColumns.forEach(cl => {
            cls.push(cl.field_name);
        });
        formData.set('filter_condition[department_id]', dps.join(','));
        formData.set('filter_condition[area_id]', ars.join(','));
        formData.set('columns', cls.join(','));
        formData.set('tab_active', this.tabType);
        formData.set('office_type', this.filter['office'].value);
        this.networkService.post(AppConst.REPORT_STORE_API, formData).subscribe(
            response => {
                if (response && !response.error_code) {
                    this.commonService.swal().fire(
                        'Lưu thành công!',
                        '',
                        'success'
                    );
                    this.modalService.dismissAll();
                    this.reportName = '';
                } else {
                    this.resErrors = {...response.field};
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    onFormApplyClick() {
        this.isOpenFormDropdown = false;
        this.key_word = '';
        this.setPage(this.tabType, this.itemPerPage, 1, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onSortClick(field_name, direction) {
        for (const key in this.sort) {
            if (this.sort.hasOwnProperty(key)) {
                this.sort[key] = '';
            }
        }
        this.sort[field_name] = direction;
        if (direction === '') {
            this.order = '';
            this.direction = '';
        } else {
            this.order = field_name;
            this.direction = direction;
        }
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onExportClick() {
        if (this.tabType === '1') {
            const dialogRef = this.dialog.open(ExportOptionComponent, {
                disableClose: true,
                width: '352px'
            });
            dialogRef.afterClosed().subscribe(
                result => {
                    if (result) {
                        this.isLoading = true;
                        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
                            this.filter['departments'], this.filter['areas'], this.filter['office'], 'id_number', 'asc', this.reportType, 1, result);
                    }
                }
            );
        } else {
            this.isLoading = true;
            this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
                this.filter['departments'], this.filter['areas'], this.filter['office'], 'id_number', 'asc', this.reportType, 1);
        }
    }

    onColumnClick() {
        this.isOpenFilterDropdown = false;
        this.isOpenFormDropdown = false;
    }

    onDepartmentChange(event, department) {
        this.reportType = null;
        department.isChecked = !!event.target.checked;
        this.filter['departments'] = [];
        this.listDepartment.forEach(dp => {
            if (dp.isChecked) {
                this.filter['departments'].push(dp);
            }
        });
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onLocationChange(event, area) {
        this.reportType = null;
        area.isChecked = !!event.target.checked;
        this.filter['areas'] = [];
        this.listLocation.forEach(lc => {
            if (lc.isChecked) {
                this.filter['areas'].push(lc);
            }
        });
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onChooseDateRange(event) {
        if (this.filter['date_range'][0].getTime() !== event[0].getTime() || this.filter['date_range'][1].getTime() !== event[1].getTime()) {
            this.reportType = null;
            this.filter['date_range'] = [...event];
            this.currentPage = 1;
            this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
                this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
        }
    }

    onResetFilterClick() {
        this.tabType = '-1';
        this.reportType = null;
        this.filter = {};
        this.filter['date_range'] = [this.beginMonth, this.today];
        this.listDepartment.forEach(department => {
            department.isChecked = false;
        });
        this.listLocation.forEach(location => {
            location.isChecked = false;
        });
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onClearDateRangeClick() {
        this.filter['date_range'] = [this.beginMonth, this.today];
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onSearchInputChange(event: string) {
        this.key_word = event;
        this.setPage(this.tabType, this.itemPerPage, 1, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onOfficeChange(event, office) {
        office.isChecked = !!event.target.checked;
        if (office.isChecked) {
            this.filter['office'] = {...office};
        } else {
            this.filter['office'] = null;
        }
        this.listOffice.forEach(of => {
            if (of.id !== office.id) {
                of.isChecked = false;
            }
        });
        this.currentPage = 1;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }

    onPageChange(page) {
        this.currentPage = page;
        this.setPage(this.tabType, this.itemPerPage, this.currentPage, this.filter['date_range'], this.key_word,
            this.filter['departments'], this.filter['areas'], this.filter['office'], this.order, this.direction, this.reportType, 0);
    }
}
