import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {AuthInterceptor} from './helpers/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import {LoggedInGuard} from './shared/guard/logged-in.guard';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        ToastrModule.forRoot({
            maxOpened: 1,
            autoDismiss: true,
            preventDuplicates: true
        }),
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        MatDialogModule
    ],
    declarations: [AppComponent],
    providers: [
        AuthGuard,
        LoggedInGuard,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
