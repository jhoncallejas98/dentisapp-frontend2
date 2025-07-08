import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateHeader } from './header/private-header';
import { PrivateFooter } from './footer/private-footer';

@Component({
    selector: 'app-private-layout',
    standalone: true,
    imports: [RouterOutlet, PrivateHeader, PrivateFooter],
    template: `
        <app-private-header></app-private-header>
        <router-outlet></router-outlet>
        <app-private-footer></app-private-footer>
    `
})
export class PrivateLayout {}