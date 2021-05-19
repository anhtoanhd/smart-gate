import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import {PermissionGuard} from '../shared/guard/permission.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'prefix' },
            {
                path: 'overview',
                loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule),
                data: {
                    title: 'Tổng quan',
                    description: 'Tổng quan tình hình nhân sự trong ngày'
                }
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
                data: {
                    title: 'Thông tin cá nhân',
                    description: 'Thông tin cá nhân'
                }
            },
            {
                path: 'hr-report',
                loadChildren: () => import('./hr-report/hr-report.module').then(m => m.HrReportModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['export_report', 'view_all_area', 'view_report_only_area'],
                    title: 'Báo cáo nhân sự',
                    description: 'Báo cáo tình hình nhân sự theo yêu cầu'
                }
            },
            {
                path: 'staff',
                loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_user'],
                    title: 'Nhân viên',
                    description: 'Thêm, sửa, xóa nhân viên'
                }
            },
            {
                path: 'department',
                loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_department'],
                    title: 'Bộ phận',
                    description: 'Thêm, sửa, xóa bộ phận'
                }
            },
            {
                path: 'location',
                loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_area'],
                    title: 'Khu vực',
                    description: 'Thêm, sửa, xóa bộ phận'
                }
            },
            {
                path: 'account',
                loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_admin_user'],
                    title: 'Tài khoản',
                    description: 'Thêm, sửa, xóa tài khoản'
                }
            },
            {
                path: 'time-setup',
                loadChildren: () => import('./times-setup/times-setup.module').then(m => m.TimesSetupModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_work_time'],
                    title: 'Ca hành chính',
                    description: 'Thiết lập thời gian làm việc ca hành chính'
                }
            },
            {
                path: 'shift',
                loadChildren: () => import('./shift/shift.module').then(m => m.ShiftModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_work_shift'],
                    title: 'Ca làm việc',
                    description: 'Thêm, sửa, xóa ca linh hoạt'
                }
            },
            {
                path: 'work-calendar',
                loadChildren: () => import('./work-calendar/work-calendar.module').then(m => m.WorkCalendarModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_work_calendar'],
                    title: 'Lịch làm việc',
                    description: 'Thông tin lịch làm việc theo ca, theo nhân viên'
                }
            },
            {
                path: 'device-setup',
                loadChildren: () => import('./device-setup/device-setup.module').then(m => m.DeviceSetupModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_device'],
                    title: 'Thiết bị',
                    description: 'Thêm, sửa, xóa thiết bị'
                }
            },
            {
                path: 'history',
                loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
                canActivate: [PermissionGuard],
                data: {
                    permission: ['manager_log_user_access'],
                    title: 'Lịch sử chấm công',
                    description: 'Chi tiết lịch sử chấm công của nhân viên'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
