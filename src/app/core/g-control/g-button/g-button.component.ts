import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'g-button',
    templateUrl: './g-button.component.html',
    styleUrls: ['./g-button.component.scss']
})
export class GButtonComponent implements OnInit {
    @Input() type = 'button';
    @Input() className = '';
    @Input() width = 150;
    @Input() height = 40;
    @Input() color = '#FFFFFF';
    @Input() borderColor = '#0E9560';
    @Input() bgColor = '#0E9560';
    @Input() bgImage: string;
    @Input() disabled: boolean;
    @Input() hasShadow = true;
    style = {};

    constructor(
        private _breakpointObserver: BreakpointObserver
    ) {
    }

    ngOnInit() {
        this.updateStyle();
    }

    updateStyle() {
        this.bgImage = this.bgImage ? `/assets/images/content/${this.bgImage}` : '';
        this.style['background-color'] = `${this.bgColor}`;
        this.style['border-color'] = `${this.borderColor}`;
        this.style['color'] = `${this.color}`;
        if (this.hasShadow) {
            this.style['box-shadow'] = '0 2px 10px rgba(0, 0, 0, 0.35)';
        } else {
            this.style['box-shadow'] = 'none';
        }
        this._breakpointObserver.observe('(max-width: 1024px)').subscribe(
            state => {
                if (state.matches) {
                    this.style['font-size'] = '13px';
                    this.style['width'] = `${this.width * 0.75}px`;
                    this.style['height'] = `${this.height * 0.75}px`;
                    if (this.bgImage) {
                        this.style['background-image'] = `url(${this.bgImage})`;
                        this.style['background-repeat'] = 'no-repeat';
                        this.style['background-size'] = '18px';
                        this.style['background-position'] = 'center left 0.5rem';
                        this.style['padding-left'] = '1.75rem';
                    }
                } else {
                    this.style['font-size'] = '14px';
                    this.style['width'] = `${this.width}px`;
                    this.style['height'] = `${this.height}px`;
                    if (this.bgImage) {
                        this.style['background-image'] = `url(${this.bgImage})`;
                        this.style['background-repeat'] = 'no-repeat';
                        this.style['background-size'] = '24px';
                        this.style['background-position'] = 'center left 1rem';
                        this.style['padding-left'] = '2rem';
                    }
                }
            }
        );
    }

    onMouseOver() {
        this.style['background-color'] = this.borderColor;
        this.style['color'] = '#FFFFFF';
        if (this.hasShadow) {
            this.style['box-shadow'] = 'inset -3px 1px 6px rgba(0, 0, 0, 0.35)';
        } else {
            this.style['box-shadow'] = 'none';
        }
    }

    onMouseOut() {
        this.style['background-color'] = this.bgColor;
        this.style['color'] = this.color;
        if (this.hasShadow) {
            this.style['box-shadow'] = '0 2px 10px rgba(0, 0, 0, 0.35)';
        } else {
            this.style['box-shadow'] = 'none';
        }
    }
}
