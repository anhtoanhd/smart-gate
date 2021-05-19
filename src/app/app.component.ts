import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        window.addEventListener('storage', (event) => {
            const credentials = sessionStorage.getItem('gateUser');
            if (event.key === 'REQUESTING_SHARED_CREDENTIALS' && credentials) {
                localStorage.setItem('CREDENTIALS_SHARING', credentials);
                localStorage.removeItem('CREDENTIALS_SHARING');
            }
            if (event.key === 'CREDENTIALS_SHARING' && !credentials) {
                sessionStorage.setItem('gateUser', event.newValue);
            }
            if (event.key === 'CREDENTIALS_FLUSH' && credentials) {
                sessionStorage.clear();
                localStorage.clear();
            }
        });
    }

    ngOnInit() {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            filter((route) => route.outlet === 'primary'),
            mergeMap((route) => route.data)
        ).subscribe((event) => {
            this.titleService.setTitle(`Smart Gate - ${event['title']}`);
            this.metaService.updateTag({
                name: 'description',
                content: event['description']
            });
         });
    }

    ngAfterViewInit(): void {
        localStorage.setItem('REQUESTING_SHARED_CREDENTIALS', Date.now().toString());
        localStorage.removeItem('REQUESTING_SHARED_CREDENTIALS');
    }
}
