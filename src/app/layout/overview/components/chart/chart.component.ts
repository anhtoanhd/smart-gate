import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {AppConst} from '../../../../appconst';
import {BaseChartDirective} from 'ng2-charts';
import {ChartOptions} from 'chart.js';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {

    @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;
    today = new Date();
    agoDay: any;
    charOptions = AppConst.LINE_CHART_OPTIONS;
    chartColors = AppConst.LINE_CHART_COLORS;
    chartLabels: any = [];
    chartDatasets: any = [];
    presentData: any = [];
    absentData: any = [];
    lateData: any = [];
    @Input() data: any[];

    constructor() {
    }

    ngOnInit() {
        this.agoDay = new Date(this.today.getTime() - (30 * 24 * 60 * 60 * 1000));
    }


    ngOnChanges(changes: SimpleChanges): void {
        this.chartLabels = [];
        this.presentData = [];
        this.absentData = [];
        this.lateData = [];
        this.chartDatasets = [];
        changes.data.currentValue.forEach(dayData => {
            this.chartLabels.push(`${dayData.date_at.substr(8, 2)}/${dayData.date_at.substr(5, 2)}`);
            this.presentData.push(dayData.user_on);
            this.absentData.push(dayData.user_not);
            this.lateData.push(dayData.user_late);
        });
        this.chartDatasets.push({data: this.presentData, fill: false, label: 'Hiện diện', lineTension: 0});
        this.chartDatasets.push({data: this.absentData, fill: false, label: 'Vắng mặt', lineTension: 0});
        this.chartDatasets.push({data: this.lateData, fill: false, label: 'Đi trễ', lineTension: 0});
    }

}
