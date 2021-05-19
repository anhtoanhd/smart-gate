import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-today-table',
    templateUrl: './today-table.component.html',
    styleUrls: ['./today-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodayTableComponent implements OnInit {

    title: string;
    @Input() route: any;
    @Input() showTime: boolean;
    @Input() type: any;
    @Input() queryParams: any;
    @Input() data = [];

    constructor(
    ) {
    }

    ngOnInit() {
        if (this.type === 'absent') {
            this.title = 'Absent today';
        } else if (this.type === 'late') {
            this.title = 'Late today';
        }
    }

}
