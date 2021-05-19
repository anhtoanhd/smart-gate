import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GButtonComponent} from './g-button/g-button.component';
import {GSearchComponent} from './g-search/g-search.component';
import {FormsModule} from '@angular/forms';
import {GPaginationComponent} from './g-pagination/g-pagination.component';
import {TranslateModule} from '@ngx-translate/core';

const GControlComponents = [
    GButtonComponent,
    GSearchComponent,
    GPaginationComponent
];

@NgModule({
    declarations: [GControlComponents],
    exports: GControlComponents,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
    ]
})
export class GControlModule {
}
