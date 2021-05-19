import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'g-search',
    templateUrl: './g-search.component.html',
    styleUrls: ['./g-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GSearchComponent implements OnInit {
    input: string;
    timer: any;
    @Input() placeholder = '';
    @Input() delay = 500;
    @Input() clearable = true;
    @Output() searchEnter = new EventEmitter<string>();
    @Output() searchInputChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onSearchClick() {
        this.searchEnter.emit(this.input);
    }

    onSearchInput() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.searchInputChange.emit(this.input);
        }, this.delay);
    }

    onClearSearch() {
        this.input = '';
        this.searchInputChange.emit(this.input);
    }
}
