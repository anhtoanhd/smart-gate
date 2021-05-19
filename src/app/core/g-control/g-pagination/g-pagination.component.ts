import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'g-pagination',
    templateUrl: './g-pagination.component.html',
    styleUrls: ['./g-pagination.component.css']
})
export class GPaginationComponent implements OnInit {

    @Input() page = 1;
    @Input() totalPages = 1;
    @Output() pageChange = new EventEmitter<number>();
    style = {};

    constructor() {
    }

    ngOnInit(): void {
        this.style['display'] = 'flex';
        this.style['align-items'] = 'center';
    }

    onEnter() {
        if (this.page <= 0) {
            this.page = 1;
        }
        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
        this.pageChange.emit(this.page);
    }

    onPreviousPageClick() {
        if (this.page > 1) {
            this.page--;
            this.pageChange.emit(this.page);
        }
    }

    onNextPageClick() {
        if (this.page < this.totalPages) {
            this.page++;
            this.pageChange.emit(this.page);
        }
    }
}
