import {environment} from '../environments/environment';

export class AppConst {

    public static HOST_URL = environment.API_DOMAIN; // Test server
    // public static HOST_URL = 'https://api-gate.smart-one.io';

    public static ADMIN_SIGNIN_API = '/api/v1/signin';
    public static ADMIN_SIGNOUT_API = '/api/v1/signout';
    public static ADMIN_FORGOT_PASSWORD_API = '/api/v1/forgot-password';
    public static ADMIN_CHANGE_PASSWORD_API = '/api/v1/admin-users/change-password';

    public static OVERVIEW_API = '/api/v1/homepage';
    public static OVERVIEW_TABLE_API = '/api/v1/history-user-works/list-for-home';

    public static HR_API = '/api/v1/history-user-works';

    public static STAFF_LIST_API = '/api/v1/users';
    public static STAFF_STORE_API = '/api/v1/users/store';
    public static STAFF_SHOW_API = '/api/v1/users/show';
    public static STAFF_SHOW_BY_CODE_API = '/api/v1/users/data-for-select';
    public static STAFF_UPDATE_API = '/api/v1/users/update';
    public static STAFF_DESTROY_API = '/api/v1/users/destroy';
    public static STAFF_ACTIVE_API = '/api/v1/users/active-disable-user';
    public static STAFF_ADVANCE_SETTING_API = '/api/v1/users/save-advanced-user-setting';
    public static STAFF_ADVANCE_SETTING_GET_API = '/api/v1/users/show-advanced';
    public static STAFF_UPDATE_WORK_SHIFT_API = '/api/v1/users/update-work-shift';

    public static DEPARTMENT_LIST_API = '/api/v1/departments';
    public static DEPARTMENT_ALL_API = '/api/v1/departments/all-department';
    public static DEPARTMENT_STORE_API = '/api/v1/departments/store';
    public static DEPARTMENT_SHOW_API = '/api/v1/departments/show';
    public static DEPARTMENT_UPDATE_API = '/api/v1/departments/update';
    public static DEPARTMENT_DESTROY_API = '/api/v1/departments/destroy';
    public static DEPARTMENT_ACTIVE_API = '/api/v1/departments/active-disable-department';

    public static LOCATION_LIST_API = '/api/v1/areas';
    public static LOCATION_ALL_API = '/api/v1/areas/all-area';
    public static LOCATION_STORE_API = '/api/v1/areas/store';
    public static LOCATION_SHOW_API = '/api/v1/areas/show';
    public static LOCATION_UPDATE_API = '/api/v1/areas/update';
    public static LOCATION_DESTROY_API = '/api/v1/areas/destroys';
    public static LOCATION_ACTIVE_API = '/api/v1/areas/active-disable-area';

    public static ACCOUNT_LIST_API = '/api/v1/admin-users';
    public static ACCOUNT_STORE_API = '/api/v1/admin-users/store';
    public static ACCOUNT_DESTROY_API = '/api/v1/admin-users/destroy';
    public static ACCOUNT_SHOW_API = '/api/v1/admin-users/show';
    public static ACCOUNT_UPDATE_API = '/api/v1/admin-users/update';

    public static ROLE_LIST_API = '/api/v1/roles';
    public static ROLE_LIST_ALL_API = '/api/v1/roles/get-all';
    public static ROLE_STORE_API = '/api/v1/roles/store';
    public static ROLE_UPDATE_API = '/api/v1/roles/update';

    public static ROLE_FOR_USER_API = '/api/v1/admin-user-role/get-info';

    public static PERMISSION_LIST_API = '/api/v1/permissions';
    public static PERMISSION_STORE_API = '/api/v1/permissions/store';
    public static PERMISSION_UPDATE_API = '/api/v1/permissions/update';

    public static ACCESS_ROLE_LIST_API = '/api/v1/role-permissions/list-data';
    public static ACCESS_ROLE_STORE_API = '/api/v1/role-permissions/store-multi';

    public static DEVICE_LIST_API = '/api/v1/devices';
    public static DEVICE_STORE_API = '/api/v1/devices/store';
    public static DEVICE_DESTROY_API = '/api/v1/devices/destroys';
    public static DEVICE_SHOW_API = '/api/v1/devices/show';
    public static DEVICE_UPDATE_API = '/api/v1/devices/update';
    public static DEVICE_SYNC_API = '/api/v1/devices/Synchronized/';
    public static DEVICE_RESTORE_DATA_API = '/api/v1/devices/get-back-data';

    public static WORKTIME_LIST_API = '/api/v1/work-times';
    public static WORKTIME_STORE_API = '/api/v1/work-times/store';
    public static WORKTIME_DESTROY_API = '/api/v1/work-times/destroy';
    public static WORKTIME_RANGE_API = '/api/v1/work-time-ranges/all-range';
    public static WORKTIME_RANGE_NEW_API = '/api/v1/work-time-ranges/all-range-new';
    public static WORK_TIME_STORE_NEW = '/api/v1/work-times/store-time-new';
    public static WORK_TIME_LIST_NEW = '/api/v1/work-times/index-new';

    public static COLUMN_STORE_API = '/api/v1/report-columns/store';

    public static REPORT_LIST_API = '/api/v1/report-templates';
    public static REPORT_STORE_API = '/api/v1/report-templates/store';

    public static IMPORT_USER_API = '/api/v1/users/import-user-excel';

    public static SHIFT_LIST_API = '/api/v1/shifts';
    public static SHIFT_STORE_API = '/api/v1/shifts/store';
    public static SHIFT_SHOW_API = '/api/v1/shifts/show';
    public static SHIFT_UPDATE_API = '/api/v1/shifts/update';
    public static SHIFT_DESTROY_API = '/api/v1/shifts/destroys';
    public static SHIFT_ACTIVE_API = '/api/v1/shifts/change-state-user';

    public static WORK_CALENDAR_INFO = '/api/v1/calendars';
    public static WORK_CALENDAR_FOLLOW_STAFF = '/api/v1/calendars/time-line-users';
    public static WORK_CALENDAR_STORE = '/api/v1/calendars/work-shift-store';
    public static WORK_CALENDAR_OUTSIDE_STAFF = '/api/v1/calendars/work-shift-all-users';
    public static WORK_CALENDAR_INSIDE_STAFF = '/api/v1/calendars/work-shift-users-chosen';
    public static WORK_CALENDAR_AREA = '/api/v1/calendars/work-shift-all-areas';
    public static WORK_SHIFT_AREA = '/api/v1/calendars/work-shift-areas';

    public static HISTORY_API = '/api/v1/log-user-access';

    public static STAFF_GENERATE_CODE_API = '/api/v1/users/generate-code';

    public static MINUTES_UNITL_AUTO_LOGOUT = 5;
    public static CHECK_INTERVALL = 60000;

    public static CHART_DURATION = 2500;
    public static LINE_CHART_OPTIONS = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: AppConst.CHART_DURATION
        },
        legend: {
            display: true,
            position: 'top',
            fill: true,
            labels: {
                padding: 60,
                boxWidth: 15
            }
        },
        tooltips: {
            backgroundColor: '#FFFFFF',
            titleFontColor: '#333333',
            bodyFontColor: '#333333',
            cornerRadius: 10
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    style: 'solid'
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                }
            }]
        }
    };
    public static LINE_CHART_COLORS = [
        {
            borderColor: '#9A81FF',
            backgroundColor: '#9A81FF',
        },
        {
            borderColor: '#EBAFDF',
            backgroundColor: '#EBAFDF',
        },
        {
            borderColor: '#F08888',
            backgroundColor: '#F08888',
        },
    ];

    public static COLORS = [
        '#FF7227', '#6E4AFF', '#FF6DE2', '#FFC10E', '#2F80ED',
        '#FF5959', '#0A7C4F', '#A17800', '#FF9C68', '#9A81FF',
        '#FF93E9', '#FFCE42', '#64A6FF', '#FC7C7C', '#41A67E',
        '#A98E3F', '#FFCAAD', '#C1B1FF', '#FFB8F1', '#FFDE7E',
        '#8EBEFF', '#FEABAB', '#75C2A4', '#B6AD94', '#FFDBC8',
        '#DCD4FF', '#FFD6F7', '#FFF1C9', '#BCD9FF', '#FFC4C4'
    ];

    // Không bao gồm ký tự đặc biệt và số
    public static VN_NAME_PATTERN = '[^\x21-\x40\x5b-\x60\x7b-\x7e]+$';

    // Không bao gồm ký tự đặc biệt
    public static VN_NAME_NUMBER_PATTERN = '[^\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]+$';

    // Bao gồm A-Z, a-z, 0-9, -, _, bắt đầu với A-Z, a-z hoặc 0-9
    public static CODE_PATTERN = '[a-zA-Z0-9-_]+';

    public static PHONE_PATTERN = '(^[\\s]+[+]?[\\d]{10,12}[\\s]+$)|(^[+]?[\\d]{10,12}[\\s]+$)|(^[\\s]+[+]?[\\d]{10,12}$)|(^[+]?[\\d]{10,12}$)';

    public static EMAIL_PATTERN = '(([^<>()\\[\\]\\\\.,;:\\s@“]+(\\.[^<>()\\[\\]\\\\.,;:\\s@”]+)*)|(“.+”))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))';

    public static PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).{8,}$';
}
