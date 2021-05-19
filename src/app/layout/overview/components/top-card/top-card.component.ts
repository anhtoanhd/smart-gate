import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-top-card',
    templateUrl: './top-card.component.html',
    styleUrls: ['./top-card.component.scss']
})
export class TopCardComponent implements OnInit {

    @Input() bgClass: string;
    @Input() header: string;
    @Input() count: string;

    constructor() {
    }

    ngOnInit() {
    }

}
