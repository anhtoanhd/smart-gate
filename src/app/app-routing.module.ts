import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import {LoggedInGuard} from './shared/guard/logged-in.guard';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        canActivate: [LoggedInGuard],
        data: {
            title: 'Đăng nhập',
            description: 'Đăng nhập tài khoản'
        }
    },
    {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
        canActivate: [LoggedInGuard],
        data: {
            title: 'Quên mật khẩu',
            description: 'Lấy lại mật khẩu'
        }
    },
    { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule) },
    { path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
    { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { /* relativeLinkResolution: 'legacy', */ useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
