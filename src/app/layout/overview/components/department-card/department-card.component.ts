import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-department-card',
  templateUrl: './department-card.component.html',
  styleUrls: ['./department-card.component.scss']
})
export class DepartmentCardComponent implements OnInit {
    @Input() title: string;
    @Input() lateValue: number;
    @Input() absentValue: number;
    @Input() presentValue: number;
    @Input() route: string;
    @Input() queryParams: any;

  constructor() { }

  ngOnInit() {
  }

}
